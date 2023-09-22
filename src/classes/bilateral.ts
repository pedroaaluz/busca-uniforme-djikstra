// import { ITileMap } from "../types/ITilesMap";
// import { AlgorithmHelper } from "./algorithmHelper";

// interface IQueues {
//   endQueue: string[];
//   startQueue: string[];
// }

// interface IBilateralInput {
//   tilesMap: ITileMap[];
// }

// export class Bilateral extends AlgorithmHelper {
//   startTile: ITileMap;
//   endTile: ITileMap;
//   queues: IQueues;
//   tilesMap: ITileMap[];

//   constructor({ tilesMap }: IBilateralInput) {
//     super();

//     const { startTile, endTile } = tilesMap.reduce(
//       (acc, cr) => {
//         const { isEnd, isStart } = cr;

//         if (isEnd) acc.endTile = cr;
//         if (isStart) acc.startTile = cr;

//         return acc;
//       },
//       { startTile: {} as ITileMap, endTile: {} as ITileMap }
//     );

//     this.queues = {
//       endQueue: [],
//       startQueue: [],
//     };

//     this.tilesMap = tilesMap;
//     this.startTile = startTile;
//     this.endTile = endTile;
//   }

//   start(): string {
//     const tilesBlocked = this.tilesMap.filter(({ isBlock }) => isBlock);
//     const tilesBlockedFormatted = tilesBlocked.map((tile) =>
//       tile.coord.join("")
//     );

//     const nodes = this.findNodes(this.startTile.coord, tilesBlockedFormatted);
    
//     // turn 1 is Start and turn 2 is a End
//     let turn:number = 1

//     const curTiles: Record<number, number[]> = {
//       1: this.startTile.coord,
//       2: this.endTile.coord
//     }
//     /**
//      *  1 - estou no objetivo?
//      *  2 - a outra fila já passou aqui? 
//      *  3 - ja passei aqui?
//      */
//     // while (false) {
//     //   if(1 === turn) {
//     //     turn += 1
//     //   } else {
//     //     turn -=1 
//     //   }
  
//     //   const [node] = this.findNodes(curTiles[turn],tilesBlockedFormatted)

      

//     }
    
//     //return "qwerqwe";
//   }
