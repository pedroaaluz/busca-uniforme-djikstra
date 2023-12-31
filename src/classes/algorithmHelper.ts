export abstract class AlgorithmHelper {
  abstract start(): void;

  findTotalCost() {
    return 0
  }

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
          nodes.push({
            index: [row, column].join(""),
            coord: [row, column],
            father: coord.join(""),
            cost: column !== columnTileCur && row !== rowTileCur ? 14 : 10,
          });
        }
      }
    }

    return nodes;
  }
}
