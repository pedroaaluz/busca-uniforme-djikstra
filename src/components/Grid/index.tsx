import { GridItem, Grid, Text, Center } from "@chakra-ui/react";
import { generatorArrayEmpty } from "../../utils/generatorArrayEmpty";
import "./index.css";
import { ITileMap } from "../../types/ITilesMap";
import React, { useState, useEffect } from "react";
import { boundaryChecker } from "../../utils/boundaryChecker";
import { coordinatesToCheck } from "../../utils/coordinatesToCheck";

interface IGeneratorGridInput {
  setTilesMap: React.Dispatch<React.SetStateAction<ITileMap[]>>;
  tilesMap: ITileMap[];
}

interface IGeneratorTilesInput {
  row: number;
  column: number;
  tilesMap: ITileMap[];
  setTilesMap: React.Dispatch<React.SetStateAction<ITileMap[]>>;
}

const handlerGridStatus = (
  index: number,
  setTilesMap: React.Dispatch<React.SetStateAction<ITileMap[]>>,
  tilesOptions,
) => {
  console.log({ index , tilesOptions});
  
  setTilesMap((oldTiles) => {
    return oldTiles.map((tile, i) => ({ ...tile, isStart: i === index }));
  });
};

const GeneratorTiles = ({
  row,
  column,
  setTilesMap,
  tilesMap
}: IGeneratorTilesInput): JSX.Element => {
  const [startTileIndex, setStartTileIndex] = useState<number>(125);
  const tilesCount = column * row;

  useEffect(() => {
    const tiles = generatorArrayEmpty(tilesCount).map((_, index) => {
      const rowIndex = Math.floor(index / column);
      const columnIndex = index % column;
  
      const isCoordinateInSet = coordinatesToCheck.some(
        ([x, y]) => x === rowIndex + 1 && y === columnIndex + 1
      );
  
      const isBlock = boundaryChecker(index, tilesCount, row) || isCoordinateInSet;

      const tilesOptions = {
        coord: [rowIndex, columnIndex],
        index,
        isBlock,
        isEnd: columnIndex === 5 && rowIndex === 2 ,
        isStart: startTileIndex === index && !isBlock,
      };
  
      return tilesOptions
    });
  
    setTilesMap(tiles)
  }, [startTileIndex])


  return <>{tilesMap.map((tilesOptions, index) => {
     return (
      <GridItem
        key={index}
        w="10"
        h="10"
        bg={tilesOptions.isBlock ? "#000" : "#d3d6db"}
        onClick={() => {
          if(!tilesOptions.isBlock && !tilesOptions.isEnd) setStartTileIndex(index);
          handlerGridStatus(index, setTilesMap, tilesOptions);
        }}
      >
        <Center>
          {startTileIndex === index   && <Text fontSize={22}> S </Text>}
          {tilesOptions.isEnd && <Text fontSize={22}> G </Text>}
        </Center>
      </GridItem>
    );
  })}</>;
};

export const GeneratorGrid = ({
  setTilesMap,
  tilesMap
}: IGeneratorGridInput): JSX.Element => {
  return (
    <>
      <Grid templateColumns="repeat(12, 1fr)" gap={1}>
        {GeneratorTiles({ row: 12, column: 12, setTilesMap, tilesMap })}
      </Grid>
    </>
  );
};
