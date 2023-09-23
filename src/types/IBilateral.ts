import { ITileMap } from "./ITilesMap";

export interface IQueues {
  endQueue: number[][];
  startQueue: number[][];
}


export interface IBilateralInput {
  tilesMap: ITileMap[];
}
