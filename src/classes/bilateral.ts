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

//     const {startTile, endTile} = tilesMap.reduce((acc, cr) => {
//       const { isEnd, isStart } = cr
  
//       if (isEnd) acc.endTile = cr 
//       if (isStart) acc.startTile = cr 
  
//       return acc 
//     }, { startTile: {} as ITileMap, endTile: {} as ITileMap})

//     this.queues = {
//       endQueue: [],
//       startQueue: []
//     }

//     this.tilesMap = tilesMap;
//     this.startTile = startTile;
//     this.endTile = endTile;
//   }

//   // findNodes(coord: number[], tilesBlocked: string[]) {
//   //   const nodes = [];

//   //   const [rowIndex, columnIndex] = coord;

//   //   // se for maior que 11 é pq já é a ultima linha
//   //   const rowSearchIndex = rowIndex + 1 < 11 ? rowIndex + 1 : rowIndex;
//   //   // se for maior que 12 é pq já é a ultima linha
//   //   const columnSearchIndex = columnIndex + 1 < 11 ? rowIndex + 1 : rowIndex;

//   //   console.log('4', { coord, rowSearchIndex, columnSearchIndex})

//   //   for (let row = 0; row === rowSearchIndex; row++) {
//   //     console.log('1')
//   //     nodes.push([rowIndex - 1/* , column - 1 */]); 
//   //     for (let column = columnSearchIndex; column === columnSearchIndex - 3; column--) {
//   //       if (
//   //         rowIndex !== row &&
//   //         columnIndex !== column &&
//   //         !tilesBlocked.includes(`${row}${column}`)
//   //       ) {
//   //         console.log('1')
//   //         nodes.push([rowIndex - 1, column - 1]);
//   //       }
//   //     } 
//   //   }

//   //   console.log('qwerdqwe',{nodes})
//   // }

//   aStarSearch(){
    
//   }

//   start(): string {
//     const tilesBlocked = this.tilesMap.filter(({ isBlock }) => isBlock);
//     const tilesBlockedFormatted = tilesBlocked.map((tile) => tile.coord.join());

//     this.findNodes(this.startTile.coord, tilesBlockedFormatted)
//     return "qwerqwe";
//   }
// }
