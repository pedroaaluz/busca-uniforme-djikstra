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

// distancia diagonal - variação do Euclides! (apenas para reta e diagonal!)
function calculateDistance(start: number[], goal: number[]) {
  const distanceX = Math.abs(start[0] - goal[0]);
  const distanceY = Math.abs(start[1] - goal[1]);

  if (distanceX > distanceY) {
    return 14 * distanceY + 10 * (distanceX - distanceY);
  }

  return 14 * distanceX + 10 * (distanceY - distanceX);
}

//distancia euclidiana
function calculateEuclidianDistance(start: number[], goal: number[]){
    const distanceX = Math.pow((start[0] - goal[0]), 2);
    const distanceY = Math.pow((start[1] - goal[1]), 2);
    const distanceBetweenPoints = Math.sqrt(distanceX + distanceY);

    return distanceBetweenPoints;
}

function totalCost(goal: number[], nodes: IFindNodes[]): ITileCostMap[] {
  const distances = nodes.map((node) => {
    const distanceEnd = calculateDistance(node.coord, goal);

    const totalCost: ITileCostMap = {
      index: node.index,
      father: node.father,
      coord: node.coord,
      distance: distanceEnd,
      cost: node.cost,
      totalCost: node.cost + distanceEnd,
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

    this.queues.openQueue.push({
      ...this.startTile,
      totalCost: calculateDistance(this.startTile.coord, this.endTile.coord),
    } as ITileCostMap);

    let currentTile = this.startTile as ITileCostMap;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { openQueue, closedQueue } = this.queues;
      //lista aberta vazia
      if (openQueue.length === 0) {
        console.log("sem caminho");
        break;
      }

      // remover tile atual da lista aberta
      this.queues.openQueue = openQueue.filter(
        (t) => t.index !== currentTile.index
      );
      this.queues.closedQueue.push(currentTile);

      // processar nós vizinhos, removendo nós da linha fechada e paredes
      const neighborNodes = this.findNodes(
        currentTile.coord,
        tilesBlockedFormatted
      ).filter((n) => !closedQueue.find((c) => c.index === n.index));

      // calcular o custo do nós vizninhos
      const neighborNodesCost = totalCost(this.endTile.coord, neighborNodes);

      console.log("neighborNodesCost");
      console.log(neighborNodesCost);

      // verificar nós repertidos e novos nós
      const { nodesInOpenQueue, newNode } = neighborNodesCost.reduce(
        (acc, cr) => {
          const nodeInOpenQueue = openQueue.find((n) => n.index === cr.index);

          if (nodeInOpenQueue) {
            acc.nodesInOpenQueue.push(cr);
          } else {
            acc.newNode.push(cr);
          }

          return acc;
        },
        {
          nodesInOpenQueue: [] as ITileCostMap[],
          newNode: [] as ITileCostMap[],
        }
      );

      // se tiver repertido, tentar atualizar os existente
      if (nodesInOpenQueue.length) {
        this.queues.openQueue = openQueue.map((node) => {
          const nr = nodesInOpenQueue.find((r) => r.index === node.index);

          if (nr) {
            node.father =
              node.totalCost > nr.totalCost ? nr.father : node.father;
          }

          return node;
        });
      }

      // se for novos nós, apenas adicionar los
      if (newNode.length) {
        console.log("newNode");
        console.log(newNode);
        openQueue.push(...newNode);
      }

      this.queues.openQueue = openQueue.filter(
        (n) => n.index !== currentTile.index
      );
      //  remover nó da lista aberta e ordenar fila com menor custo F
      const [nextNode] = this.queues.openQueue.sort(
        (a, b) => a.totalCost - b.totalCost
      );

      console.log("nextNode");
      console.log(nextNode);
      console.log("openQueue");
      console.log(openQueue);

      currentTile = nextNode;

      if (currentTile.index === this.endTile.index) {
        console.log("weqqwe");
        break;
      }
    }

    const path = [];

    let currentFather = currentTile?.father;
    let child: ITileCostMap = currentTile;
    const closedQueueReversed =  this.queues.closedQueue.reverse()

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
    
    console.log(closedQueueReversed.reduce((acc, cr) => {
      return acc + cr.cost!
    }, 0))

    const allNodes = this.queues.openQueue.map(({ index }) => index);
    const allNodes2 = this.queues.closedQueue.map(({ index }) => index);
    const pathIds = path.map((p) => p.index)
    return this.tilesMap.map((t) => {
      delete t.background;
      if (allNodes.includes(t.index)) {
        t.background = "#b83b5e";
      }

      if (allNodes2.includes(t.index)) {
        t.background = "#f9ed69";
      }

      if (pathIds.includes(t.index)) {
        t.background = "#66B039";
      } 


      if ([this.endTile.index, this.startTile.index].includes(t.index)) {
        t.background = "#66B039";
      } 

      return t;
    });
  }
}
