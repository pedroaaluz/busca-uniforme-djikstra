import { ITileMap } from "../types/ITilesMap";
import { aStarearch } from "./aStarSearch";

export const algorithmSelector = (algorithm: "aStarSearch", tilesMap: ITileMap[]) => {
  switch (algorithm) {
    case "aStarSearch":
      return new aStarearch({tilesMap})
    default:
      throw new Error('algorithm not found')
  }
};
