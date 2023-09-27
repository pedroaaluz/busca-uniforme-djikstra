import { IFindNodes } from "../types/IFindNodes";
import { ITileMap } from "../types/ITilesMap";
import { AlgorithmHelper } from "./algorithmHelper";


interface ITileCostMap extends ITileMap {
  totalCost: number;
  distance: number;
  father: string;
}

interface IQueues {
  openQueue: ITileCostMap[];
  closedQueue: string[];
}

interface IaStarInput {
  tilesMap: ITileMap[];
}

export class AStarearch extends AlgorithmHelper {
  startTile: ITileMap;
  endTile: ITileMap;
  queues: IQueues;
  tilesMap: ITileMap[];

  constructor({ tilesMap }: IaStarInput) {
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
      openQueue: [],
      closedQueue: [],
    };

    this.tilesMap = tilesMap;
    this.startTile = startTile;
    this.endTile = endTile;

    this.queues.closedQueue.push(startTile.coord.join(""));
  }

  start() {
    const tilesBlocked = this.tilesMap.filter(({ isBlock }) => isBlock);
    const tilesBlockedFormatted = tilesBlocked.map((tile) =>
      tile.coord.join("")
    );

    const pathsTaken = [];
    let actualTile: ITileMap & { totalCost?: number } = this.startTile;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const nodes = this.findNodes(
        actualTile.coord,
        tilesBlockedFormatted
      ).filter((n) => !this.queues.closedQueue.includes(n.coord.join("")));

      if (nodes.find((n) => n.coord.join("") === this.endTile.index)) {
        break;
      }
    
      const nodeWithCost = totalCost(this.endTile.coord, nodes).sort((a, b) => {
        if (a.totalCost !== b.totalCost) {
          return a.totalCost - b.totalCost;
        } else {
          return a.distance - b.distance;
        }
      });

      let [node] = nodeWithCost;

      if(!node) {
        [node] = this.queues.openQueue.sort((a, b) => {
          if (a.totalCost !== b.totalCost) {
            return a.totalCost - b.totalCost;
          } else {
            return a.distance - b.distance;
          }
        }); 

        
      }

      this.queues.openQueue.push(nodeWithCost);

      // Logica de adcionar na lista aberta nodesFound
      // Logica adicionar actualTile na lista fechada

      /***
       * 
       * 
       * 
       * 
       */

      this.queues.closedQueue.push(node.index);
      actualTile = node;
      pathsTaken.push(actualTile);

      console.log({actualTile, node, nodeWithCost })

    }

    const allNodes = pathsTaken.map(({ index }) => index);

    allNodes.push(this.endTile.index);
    allNodes.push(this.startTile.index);

    return this.tilesMap.map((t) => {
      delete t.background
      if (allNodes.includes(t.index)) {
        t.background = "#b83b5e";
      }

      return t;
    });
  }
}

function calculateDistance(start: number[], goal: number[]) {
  const distanceX = Math.abs(start[0] - goal[0]);
  const distanceY = Math.abs(start[1] - goal[1]);

  if (distanceX > distanceY) {
    return 14 * distanceY + 10 * (distanceX - distanceY);
  }

  return 14 * distanceX + 10 * (distanceY - distanceX);
}
function totalCost(
  goal: number[],
  nodes: IFindNodes[]
) {
  const distances = nodes.map((node) => {
    const distance = calculateDistance(node.coord, goal);
    return {
      coord: node.coord,
      distance,
      cost: node.cost,
      totalCost: node.cost + distance,
      index: node.coord.join(""),
      father: node.father
    };
  });

  return distances;
}
