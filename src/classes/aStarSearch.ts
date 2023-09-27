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

function totalCost(
  goal: number[],
  currentTile: ITileMap,
  nodes: IFindNodes[]
): ITileCostMap[] {
  const distances = nodes.map((node) => {
    const distanceEnd = calculateDistance(node.coord, goal);
    const distanceCurrentTile = calculateDistance(
      node.coord,
      currentTile.coord
    );

    const totalCost: ITileCostMap = {
      index: node.index,
      father: node.father,
      coord: node.coord,
      distance: distanceEnd,
      cost: node.cost,
      totalCost: node.cost + distanceEnd + distanceCurrentTile,
    };

    return totalCost;
  });

  return distances;
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
  }

  start() {
    const tilesBlocked = this.tilesMap.filter(({ isBlock }) => isBlock);
    const tilesBlockedFormatted = tilesBlocked.map((tile) => tile.index);

    let currentTile = this.startTile as ITileCostMap;

    const x = this.findNodes(
      currentTile.coord,
      tilesBlockedFormatted
    )

    const nodeWithCost = totalCost(
      this.endTile.coord,
      currentTile,
      x
    );
    
    this.queues.openQueue.push(nodeWithCost);

    let i = 0

    const path = [];
    
    try {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        i++
        console.log(i)
  
        const tilesIdsInClosedQueue = this.queues.closedQueue.map(
          ({ index }) => index
        );
  
        console.log(`tilesIdsInClosedQueue ${i}`,tilesIdsInClosedQueue)
  
        this.queues.closedQueue.push(currentTile);
  
        // nós encontrados ao redor do nó atual
        const nodesFound = this.findNodes(
          currentTile.coord,
          tilesBlockedFormatted
        ).filter((n) => !tilesIdsInClosedQueue.includes(n.index));
  
        // pegar o custo dos nó na borda do tile atual
        const nodeWithCost = totalCost(
          this.endTile.coord,
          currentTile,
          nodesFound
        );
  
        const openQueue = this.queues.openQueue;

        // verificar se a lista aberta possui os novos nós de bordar, atualizar o pai dos nós presentes na openQueue se necessário
        const newValuesToOpenQueue = openQueue.reduce((acc, cr) => {
          const nodeInOpenQueue = nodeWithCost.find((n, index) =>{
            return n.index === cr.index
          });
  
          if (nodeInOpenQueue) {
            // caso o nó atual seja um pai mais proximo hehehehjeh, trocar
            cr.father =
              nodeInOpenQueue.totalCost > cr.totalCost
                ? nodeInOpenQueue.father
                : cr.father;
          }
  
  
          acc.push(cr);
  
          return acc;
        }, [] as ITileCostMap[]);
  
        console.log(`newValuesToOpenQueue ${i}`, newValuesToOpenQueue)
        console.log(`openQueue ${i}`, openQueue)
        console.log(currentTile.index )
        if (currentTile.index === '56') {
          console.log('qwerqwerqwerqwerqwerqw', { nodesFound, newValuesToOpenQueue})
        }

        const [nextNode] = newValuesToOpenQueue.sort(
          (a, b) => a.totalCost - b.totalCost
        );
  
  
        this.queues.openQueue.push(...newValuesToOpenQueue);
        currentTile = nextNode;
        
  
        if (currentTile.index === this.endTile.index) {
          this.queues.closedQueue.push(currentTile);
          break;
        }
      }

      let currentFather = currentTile?.father;
      let child: ITileCostMap = currentTile;
  
      const closedQueueReversed =  this.queues.closedQueue.reverse()
      
      console.log()
      // eslint-disable-next-line no-constant-condition
      while (true) {
        child = closedQueueReversed.find((n) => {
          return n.index === currentFather;
        })!;
  
        path.push(child);
  
        currentFather = child.father;
  
        if (currentFather === this.startTile.index) {
          break
        }
      }
    } catch (error) {
      
      const closedQueueReversed =  this.queues.closedQueue.reverse()
      
      console.log('closedQueueReversed', { closedQueueReversed })
    }

    const allNodes = this.queues.openQueue.map(({ index }) => index);

    const pathIds = path.map(({ index }) => index);
    return this.tilesMap.map((t) => {
      delete t.background;
      if (allNodes.includes(t.index)) {
        t.background = "#b83b5e";
      }

      if (pathIds.includes(t.index)) {
        t.background = "#f9ed69";
      }

      if ([this.endTile.index, this.startTile.index].includes(t.index)) {
        t.background = "#f9ed69";
      }

      return t;
    });
  }
}
