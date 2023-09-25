import { IFindNodes } from "../types/IFindNodes";
import { ITileMap } from "../types/ITilesMap";
import { AlgorithmHelper } from "./algorithmHelper";


interface IQueues{
    openQueue: string[];
    closedQueue: string[];
}

interface IaStarInput{
    tilesMap: ITileMap[];
}

export class aStarearch extends AlgorithmHelper{
    startTile: ITileMap;
    endTile: ITileMap;
    queues: IQueues;
    actualTile: ITileMap;
    tilesMap: ITileMap[];

    constructor({tilesMap}: IaStarInput){
        super();

        const {startTile, endTile} = tilesMap.reduce((acc, cr) => {
            const { isEnd, isStart } = cr
        
            if (isEnd) acc.endTile = cr 
            if (isStart) acc.startTile = cr 
        
            return acc 
          }, { startTile: {} as ITileMap, endTile: {} as ITileMap})
      
          this.queues = {
            openQueue: [],
            closedQueue: []
          }
      
          this.tilesMap = tilesMap;
          this.startTile = startTile;
          this.endTile = endTile;
          this.actualTile = startTile
          this.actualTile.cost = 0

          this.queues.closedQueue.push(startTile.coord.join(""))
    }

    start(): string {
        const tilesBlocked = this.tilesMap.filter(({ isBlock }) => isBlock);
        const tilesBlockedFormatted = tilesBlocked.map((tile) =>
        tile.coord.join("")
        );

        const nodes = this.findNodes(this.startTile.coord, tilesBlockedFormatted);

        console.log(nodes)
        console.log(this.actualTile)
        console.log(Gcost(nodes, this.actualTile))

        console.log(Heuristic(this.endTile.coord,nodes,))

        const distancias = Heuristic(this.endTile.coord,nodes)

        const menorValor = distancias.sort()

        const lowest = menorValor[0]

        console.log(lowest)
        

        return "aa"

    } 
}
    function calculateDistance(start: number[], goal: number[]){
        const distanceX = Math.pow((start[0] - goal[0]), 2);
        const distanceY = Math.pow((start[1] - goal[1]), 2);

        const distanceBetweenPoints = Math.sqrt(distanceX + distanceY);

        return distanceBetweenPoints;
    }
    
    function Gcost(nodesToCalc: IFindNodes[], actualTile: ITileMap): number[] {

        const costs : number[] = []
    
        nodesToCalc.forEach(el => {
            costs.push(actualTile.cost + el.cost) 
        });
        
        return costs
    }      

    function Heuristic(goal: number[], nodes: IFindNodes[]) : number[] {
        const distances: number[] = []

        nodes.forEach(el => {
            distances.push(calculateDistance(el.coord, goal))
        });

        return distances
    }
