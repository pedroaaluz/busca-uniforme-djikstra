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
    }

    calculateDistance(start: number[], goal: number[]){
        
    }

}