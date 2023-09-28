export interface ITileMap {
  coord: number[];
  isBlock?: boolean;
  isStart?:boolean;
  isEnd?: boolean;
  index: string;
  background?: string;
  cost?: number;
}


export interface ITileCostMap extends ITileMap {
  totalCost: number;
  distance: number;
  father: string;
}