import { ITileMap } from "../types/ITilesMap";
import { calculateDiagonalDistance } from "../utils/calculateDiagonalDistance";
import { calculateEuclidianDistance } from "../utils/calculateEuclidianDistance";
import { AlgorithmHelper } from "./algorithmHelper";

interface ITileCostMap extends ITileMap {
  totalCost: number;
  distance: number;
  father: string;
}

interface IQueues {
  openQueue: ITileCostMap[];
  closedQueue: ITileCostMap[];
}

interface IaStarInput {
  tilesMap: ITileMap[];
  heuristic: string;
}

type TCalculateHeuristic =  (start: number[], goal: number[]) => number;

export class AStarSearch extends AlgorithmHelper {
  startTile: ITileMap;
  endTile: ITileMap;
  queues: IQueues;
  tilesMap: ITileMap[];
  path: ITileCostMap[];
  calculateHeuristic: TCalculateHeuristic;

  constructor({ tilesMap, heuristic }: IaStarInput) {
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

    if(!heuristic) throw new Error('heuristic is required');
    
    this.calculateHeuristic = heuristic === 'diagonal' ? calculateDiagonalDistance : calculateEuclidianDistance

    this.queues = {
      openQueue: [],
      closedQueue: [],
    };

    this.path = []
    this.tilesMap = tilesMap;
    this.startTile = startTile;
    this.endTile = endTile;
  }

  findTotalCost() {
    return this.path.reduce((acc,cr)=> { return acc + cr.totalCost}, 0)
  }

  start() {
    const tilesBlocked = this.tilesMap.filter(({ isBlock }) => isBlock);
    const tilesBlockedFormatted = tilesBlocked.map((tile) => tile.index);

    const startCostMap: ITileCostMap = {
      ...this.startTile,
      totalCost: this.calculateHeuristic(
        this.startTile.coord,
        this.endTile.coord
      ),
      distance: 0,
      father: "",
    };

    this.queues.openQueue = [startCostMap];

    // eslint-disable-next-line no-constant-condition
    while (this.queues.openQueue.length > 0) {
      const { openQueue, closedQueue } = this.queues;

      this.queues.openQueue = openQueue.sort(
        (a, b) => a.totalCost - b.totalCost
      );

      const currentTile = openQueue.shift()!;

      this.queues.closedQueue.push(currentTile);

      if (currentTile.index === this.endTile.index) {
        console.log("cheguuuuuuuei");
        break;
      }

      const neighborNodes = this.findNodes(
        currentTile.coord,
        tilesBlockedFormatted
      ).filter((n) => !closedQueue.find((c) => c.index === n.index));

      
      neighborNodes.forEach((node) => {
        const nodeWithCost: ITileCostMap = {
          ...node,
          // distance considerando o nó atual + custo de movimento
          distance: currentTile.distance + node.cost,
          // custo total
          totalCost:
            currentTile.distance +
            node.cost +
            this.calculateHeuristic(node.coord, this.endTile.coord),
          father: currentTile.index,
        };

        const existingNode = openQueue.find((n) => n.index === node.index);

        if (!existingNode) {
          this.queues.openQueue.push(nodeWithCost);
        } else if (nodeWithCost.totalCost < existingNode.totalCost) {
          existingNode.father = nodeWithCost.father;
          existingNode.totalCost = nodeWithCost.totalCost;
        }
      });
    }

    let currentFather = this.endTile.index;

    while (currentFather !== "") {
      const currentNode = this.queues.closedQueue.find(
        (n) => n.index === currentFather
      )!;

      this.path.push(currentNode);
      currentFather = currentNode.father;
    }

    const nodesInOpenQueue = this.queues.openQueue.map(({ index }) => index);
    const nodesInclosedQueue = this.queues.closedQueue.map(
      ({ index }) => index
    );
    const nodesInPath =  this.path.map((p) => p.index);

    const {closedQueue, openQueue} = this.queues
    const allTiles = [...closedQueue, ...openQueue ]

    return this.tilesMap.map((t) => {
      delete t.background;

      if (t.isBlock) return t;

      // tudo na fila aberta fica vermelho
      if (nodesInOpenQueue.includes(t.index) ) t.background = "#b83b5e";
      // tudo na fila fechada fica amarela
      if (nodesInclosedQueue.includes(t.index)) t.background = "#f9ed69";
      // o caminho achado
      if (nodesInPath.includes(t.index)) t.background = "#66B039";

      const tileCost = allTiles.find((at) => at.index === t.index);

      return {...t, ...tileCost };
    });
  }
}
