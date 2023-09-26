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

    //actualTile.coord.join("") !== this.endTile.coord.join("")
    let actualTile: ITileMap & {totalCost?: number,  } = this.startTile
    while(this.endTile.index !== actualTile.index){
      const nodes = this.findNodes(this.startTile.coord, tilesBlockedFormatted).filter((n) => !this.queues.closedQueue.includes(n.coord.join("")) )
      console.log(nodes)
      

    const x = totalCost(this.endTile.coord, nodes).sort()
    console.log(x)
    
    const [node, ] = x
    this.queues.closedQueue.push(node.index)
    actualTile = node

    }

    //console.log(custo)
    //console.log(custo)
    return "aaa";
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
): { coord: number[]; distance: number; cost: number; totalCost: number, index: string }[] {
  const distances = nodes.map((node) => {
    const distance = calculateDistance(node.coord, goal);
    return {
      coord: node.coord,
      distance,
      cost: node.cost,
      totalCost: node.cost + distance,
      index: node.coord.join("")
    };
  });

  return distances;

// function Gcost(
//   nodesToCalc: IFindNodes[],
//   actualTile: ITileMap
// ): { coord: number[]; cost: number }[] {
//   const costs: { coord: number[]; cost: number }[] = [];

//   nodesToCalc.forEach((el) => {
//     const a = { coord: el.coord, cost: actualTile.cost + el.cost };
//     costs.push(a);
//   });

//   return costs;
// }

}
