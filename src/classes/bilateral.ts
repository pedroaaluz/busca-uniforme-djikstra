import type { ITileMap } from "../types/ITilesMap";
import type { IQueues, IBilateralInput } from "../types/IBilateral";

import { AlgorithmHelper } from "./algorithmHelper";
export class Bilateral extends AlgorithmHelper {
  startTile: ITileMap;
  endTile: ITileMap;
  queues: IQueues;
  tilesMap: ITileMap[];
  path: string[];

  constructor({ tilesMap }: IBilateralInput) {
   super();

    const { startTile, endTile } = tilesMap.reduce(
      (acc, cr) => {
        const { isEnd, isStart } = cr;

        if (isEnd) acc.endTile = cr;
        if (isStart) acc.startTile = cr;

        return acc;
      },
      { startTile: {} as ITileMap, endTile: {} as ITileMap }
    );

    this.queues = {
      endQueue: [],
      startQueue: [startTile.coord],
    };

    this.path = [];
    this.tilesMap = tilesMap;
    this.startTile = startTile;
    this.endTile = endTile;
  }

  addElementInStartQueue(coord: number[]) {
    this.queues.startQueue.push(coord);
  }
  addElementInEndQueue(coord: number[]) {
    this.queues.endQueue.push(coord);
  }

  verifyElementInQueue(coord: number[], queue: number[][]) {
    const coordJoin = coord.join("");

    return queue.find((e) => e.join('') === coordJoin);
  }

  findTileOptions(coord: number[]) {
    return this.tilesMap.find((t) => t.index === coord.join(""));
  }

  start() {
    const tilesBlocked = this.tilesMap.filter(({ isBlock }) => isBlock);
    const tilesBlockedFormatted = tilesBlocked.map((tile) =>
      tile.coord.join("")
    );

    // turn 1 is Start and turn 2 is a End
    let turn: number = 1;

    const startSearch = {
      currentTiles: this.startTile,
    };

    const endSearch = {
      currentTiles: this.endTile,
    };

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { currentTiles } = turn === 1 ? startSearch : endSearch;
      const { startQueue, endQueue } = this.queues;
      const nodes = this.findNodes(currentTiles.coord, tilesBlockedFormatted);
      const queue = turn === 1 ? startQueue : endQueue;

      let node: undefined | { coord: number[]; cost: number };
      if (turn === 1) {
        // 1 - estou no objetivo?
        if (currentTiles.isEnd) {
          console.log("cheguei", { turn });
          break;
        }

        // 2 - a outra fila já passou aqui?
        if (
          this.verifyElementInQueue(currentTiles.coord, this.queues.endQueue)
        ) {
          console.log("cheguei", { turn });
          break;
        }

        // 3 - obter nó não repertido
        [node] = nodes.filter((n) => {
          return (
            !this.verifyElementInQueue(n.coord, queue)
          );
        });

        // se o for um beco sem sair, é necessário ir voltando nos nó da fila até achar um caminho
        if (!node) {
          const newCoord = queue.find((coord) => {
            const [row, column] = coord;

            const nodesFounded = this.findNodes(
              [row, column],
              tilesBlockedFormatted
            );

            const removeNodesInQueue = nodesFounded.filter(
              (n) => !this.verifyElementInQueue(n.coord, queue)
            );

            return removeNodesInQueue.length > 0;
          })!;

          const [row, column] = newCoord;

          node = { coord: [row, column], cost: 1 };
        }

        startSearch.currentTiles = this.findTileOptions(node.coord)!;

        this.addElementInStartQueue(node.coord);
        console.log(node)
        turn++;
      } else {
        if (currentTiles.isStart) {
          console.log("cheguei", { turn });
          break;
        }

        if (
          this.verifyElementInQueue(currentTiles.coord, this.queues.startQueue)
        ) {
          console.log("cheguei", { turn });
          break;
        }

        [node] = nodes.filter(
          (n) =>
            n.coord.join("") !== currentTiles.coord.join("") &&
            !this.verifyElementInQueue(n.coord, queue)
        );

        if (!node) {
          const newCoord = queue.find((coord) => {
            const [row, column] = coord;

            const nodesFounded = this.findNodes(
              [Number(row), Number(column)],
              tilesBlockedFormatted
            );

            const removeNodesInQueue = nodesFounded.filter(
              (n) =>
                n.coord.join("") !== currentTiles.coord.join("") &&
                !this.verifyElementInQueue(n.coord, queue)
            );

            return removeNodesInQueue.length > 0;
          })!;

          const [row, column] = newCoord;

          node = { coord: [Number(row), Number(column)], cost: 1 };
        }
        endSearch.currentTiles = this.findTileOptions(node.coord)!;

        this.addElementInEndQueue(node.coord);

        turn--;
      }
    }


    const { endQueue, startQueue } = this.queues;

    const endQueueStringified = endQueue?.map((e) => e.join(''));
    const startQueueStringified = startQueue?.map((s) => s.join(''));

    const allNodes = [...new Set([endQueueStringified, startQueueStringified].flat())];

    const tilesFindInAlgorithm = this.tilesMap.map((t) => {
      if (!t.isBlock) {
        if (allNodes.includes(t.index)) {
          if (endQueueStringified.includes(t.index) && startQueueStringified.includes(t.index)) {
            t.background = "#521262";
          } else {
            t.background = startQueueStringified.includes(t.index)
              ? "#b83b5e"
              : "#30e3ca";
          }
        }

        if (t.index === this.startTile.index || t.index === this.endTile.index) {
          t.background = t.isStart ? "#b83b5e" : "#30e3ca";
        }
      }
      return t;
    })

    return tilesFindInAlgorithm
  }
}
