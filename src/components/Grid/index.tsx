import { GridItem, Grid, Text} from "@chakra-ui/react";
import { generatorArrayEmpty } from "../../utils/generatorArrayEmpty";
import "./index.css";
import { ITileMap } from "../../types/ITilesMap";

interface IGeneratorGridInput {
  setTilesMap: React.Dispatch<React.SetStateAction<ITileMap[]>>;
}

interface IGeneratorTilesInput {
  row: number;
  column: number;
  setTilesMap: React.Dispatch<React.SetStateAction<ITileMap[]>>;
}

const boundaryChecker = (index: number, tilesCount: number, row: number) => {
  const isTopRow = index < row;
  const isBottomRow = index >= tilesCount - row;
  const isLeftColumn = index % row === 0;
  const isRightColumn = (index + 1) % row === 0;

  return isLeftColumn || isRightColumn || isBottomRow || isTopRow;
};

const coordinatesToCheck = [
  [1, 7],
  [2, 7],
  [3, 7],
  [4, 4],
  [4, 5],
  [4, 6],
  [4, 7],
  [5, 4],
  [6, 4],
  [6, 6],
  [7, 4],
  [7, 6],
  [8, 6],
  [9, 6],
  [9, 5],
  [10, 5],
  [11, 5],
];

const generatorTiles = ({
  row,
  column,
  setTilesMap,
}: IGeneratorTilesInput): JSX.Element => {
  const tilesCount = column * row;

  return (
    <>
      {generatorArrayEmpty(tilesCount).map((_, index) => {
        const rowIndex = Math.floor(index / column)
        const columnIndex =  index % column

        const isCoordinateInSet = coordinatesToCheck.some(([x, y]) => x === rowIndex + 1 && y === columnIndex + 1);

        const isBlock = boundaryChecker(index, tilesCount, row) || isCoordinateInSet;
        
        setTilesMap((oldTiles) => [
          ...oldTiles,
          {
            coord: [rowIndex, columnIndex],
            index,
            isBlock,
            isEnd: false,
            isStart: false,
          },
        ]);

        // colocar condicional de inicio e fim
        return (
          <GridItem w="10" h="10" bg={isBlock ? "#000" : "#d3d6db"} >
            <Text> PEdro </Text>
          </ GridItem >
        )
      
      })}
    </>
  );
};

export const GeneratorGrid = ({
  setTilesMap,
}: IGeneratorGridInput): JSX.Element => {
  return (
    <>
      <Grid templateColumns="repeat(12, 1fr)" gap={1}>
        {generatorTiles({ row: 12, column: 12, setTilesMap })}
      </Grid>
    </>
  );
};
