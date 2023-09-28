import { ITileMap } from "../types/ITilesMap";
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
}

function calculateDistance(start: number[], goal: number[]) {
  const distanceX = Math.abs(start[0] - goal[0]);
  const distanceY = Math.abs(start[1] - goal[1]);

  if (distanceX > distanceY) {
    return 14 * distanceY + 10 * (distanceX - distanceY);
  }

  return 14 * distanceX + 10 * (distanceY - distanceX);
}

function calculateEuclidianDistance(start: number[], goal: number[]) {
  const distanceX = Math.pow(start[0] - goal[0], 2);
  const distanceY = Math.pow(start[1] - goal[1], 2);

  const distanceBetweenPoints = Math.sqrt(distanceX + distanceY);

  const numberParsed = Number(distanceBetweenPoints.toFixed(1))
  return numberParsed;
} 

export class AStarSearch extends AlgorithmHelper {
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
  }

  start() {
    const tilesBlocked = this.tilesMap.filter(({ isBlock }) => isBlock);
    const tilesBlockedFormatted = tilesBlocked.map((tile) => tile.index);

    const startCostMap: ITileCostMap = {
      ...this.startTile,
      totalCost: calculateEuclidianDistance(
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

      this.queues.openQueue = openQueue.filter(
        (t) => t.index !== currentTile.index
      );
      this.queues.closedQueue.push(currentTile);

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
            calculateEuclidianDistance(node.coord, this.endTile.coord),
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

    const path = [];
    let currentFather = this.endTile.index;

    while (currentFather !== "") {
      const currentNode = this.queues.closedQueue.find(
        (n) => n.index === currentFather
      )!;

      path.push(currentNode);
      currentFather = currentNode.father;
    }

    const nodesInOpenQueue = this.queues.openQueue.map(({ index }) => index);
    const nodesInclosedQueue = this.queues.closedQueue.map(
      ({ index }) => index
    );
    const nodesInPath = path.map((p) => p.index);

    const {closedQueue, openQueue} = this.queues
    const allTiles = [...closedQueue, ...openQueue ]

    return this.tilesMap.map((t) => {
      delete t.background;
      if (t.isBlock) return t;

      if (nodesInOpenQueue.includes(t.index)) {
        t.background = "#b83b5e";
      }

      if (nodesInclosedQueue.includes(t.index)) {
        t.background = "#f9ed69";
      }

      if (nodesInPath.includes(t.index)) {
        t.background = "#66B039";
      }

      if ([this.endTile.index, this.startTile.index].includes(t.index)) {
        t.background = "#66B039";
      }

      const tileCost = allTiles.find((at) => at.index === t.index);

      return {...t, ...tileCost };
    });
  }
}
