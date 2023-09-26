
export abstract class AlgorithmHelper {
  abstract start(): void;

  findNodes(coord: number[], tilesBlocked: string[]) {
    const nodes = [];

    const [rowTileCur, columnTileCur] = coord;

    for (let row = rowTileCur - 1; row <= rowTileCur + 1; row++) {
      for (
        let column = columnTileCur - 1;
        column <= columnTileCur + 1;
        column++
      ) {
        if (
          coord.join("") !== `${row}${column}` &&
          !tilesBlocked.includes(`${row}${column}`)
        ) {
          nodes.push({coord: [row, column], cost: (column !== columnTileCur && row !== rowTileCur) ? 14 : 10});
        }
      }
    }

    return nodes
  }
}
