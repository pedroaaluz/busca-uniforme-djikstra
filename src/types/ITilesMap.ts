export interface ITileMap {
  coord: number[];
  isBlock?: boolean;
  isStart?:boolean;
  isEnd?: boolean;
  index: string;
  background?: string;
}
