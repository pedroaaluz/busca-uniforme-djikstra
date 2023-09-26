import { ITileMap } from "../types/ITilesMap";
import { aStarearch } from "./aStarSearch";
import { Bilateral } from "./bilateral";

export const algorithmSelector = (algorithm: string, tilesMap: ITileMap[]) => {
  switch (algorithm) {
    case "aStarSearch":
      return new aStarearch({tilesMap})
    case "bilateral":
      return new Bilateral({tilesMap})
    default:
      throw new Error('algorithm not found')
  }
};
