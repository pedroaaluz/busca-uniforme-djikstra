import { IFindNodes } from "../types/IFindNodes";
import { ITileMap } from "../types/ITilesMap";
import { AlgorithmHelper } from "./algorithmHelper";

interface IQueues {
  openQueue: string[];
  closedQueue: string[];
}

interface IaStarInput {
  tilesMap: ITileMap[];
}

export class aStarearch extends AlgorithmHelper {
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

  start(): string {
    const tilesBlocked = this.tilesMap.filter(({ isBlock }) => isBlock);
    const tilesBlockedFormatted = tilesBlocked.map((tile) =>
      tile.coord.join("")
    );

    // 
    const pathsTaken = []
    let actualTile: ITileMap & { totalCost?: number } = this.startTile;
    while (true) {
      const nodes = this.findNodes(actualTile.coord, tilesBlockedFormatted).filter((n) => !this.queues.closedQueue.includes(n.coord.join("")) )

      if(nodes.find((n) => n.coord.join('') === this.endTile.index)) {
        break
      }
      console.log(nodes);
      const x = totalCost(this.endTile.coord, nodes).sort((a, b) => {
        if (a.totalCost !== b.totalCost) {
          return a.totalCost - b.totalCost;
        } else {
          return a.distance - b.distance;
        }
      });

      const [node] = x;
      this.queues.closedQueue.push(node.index);
      actualTile = node;
      pathsTaken.push(actualTile)
    }

    //console.log(custo)
    return pathsTaken;
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
): {
  coord: number[];
  distance: number;
  cost: number;
  totalCost: number;
  index: string;
}[] {
  const distances = nodes.map((node) => {
    const distance = calculateDistance(node.coord, goal);
    return {
      coord: node.coord,
      distance,
      cost: node.cost,
      totalCost: node.cost + distance,
      index: node.coord.join(""),
    };
  });

  return distances;
}
