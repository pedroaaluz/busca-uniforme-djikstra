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

        let custo = Gcost(nodes, this.actualTile)
        let heuristica = Heuristic(this.endTile.coord, nodes)

        //console.log(custo)
        //console.log(custo)

        let custoTotal = nodes.map(a => { 
            let b = { coord: a.coord, cost: custo.forEach(el => el.cost), distance: heuristica.forEach(el => el.distancia)}
            return b
        })

        console.log(custoTotal)
        return "aaa"
    }

    } 
    function calculateDistance(start: number[], goal: number[]){
        const distanceX = Math.pow((start[0] - goal[0]), 2);
        const distanceY = Math.pow((start[1] - goal[1]), 2);

        const distanceBetweenPoints = Math.sqrt(distanceX + distanceY);

        return distanceBetweenPoints;
    }
    
    function Gcost(nodesToCalc: IFindNodes[], actualTile: ITileMap) : { coord: number[], cost: number }[] {

        const costs : { coord: number[], cost: number }[] = []
    
        nodesToCalc.forEach(el => {
            const a = { coord: el.coord, cost: actualTile.cost  + el.cost  }
            costs.push(a) 
        });
        
        return costs
    }      

    function Heuristic(goal: number[], nodes: IFindNodes[]) : { coord: number[], distancia: number }[]{
        const distances: { coord: number[], distancia: number }[] = []

        nodes.forEach(element => {
            const a = { coord: element.coord, distancia: calculateDistance(element.coord, goal) }
            distances.push(a)
        });
        
        return distances
    }
