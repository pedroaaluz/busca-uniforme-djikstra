import { ITileMap } from "../types/ITilesMap";
import { AStarSearch } from "./aStarSearch";
import { Bilateral } from "./bilateral";

export const algorithmSelector = (algorithm: string, tilesMap: ITileMap[]) => {
  switch (algorithm) {
    case "diagonal":
      return new AStarSearch({tilesMap, heuristic: 'diagonal'})
    case "euclides":
      return new AStarSearch({tilesMap, heuristic: 'euclides'})
    case "bilateral":
      return new Bilateral({tilesMap})
    default:
      throw new Error('algorithm not found')
  }
};
