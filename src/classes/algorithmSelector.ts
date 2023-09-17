import { ITileMap } from "../types/ITilesMap";
import { Bilateral } from "./bilateral";

export const algorithmSelector = (algorithm: "bilateral", tilesMap: ITileMap[]) => {
  switch (algorithm) {
    case "bilateral":
      return new Bilateral({tilesMap})
    default:
      throw new Error('algorithm not found')
  }
};
