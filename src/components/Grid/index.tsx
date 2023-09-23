import { GridItem, Grid, Text, Center } from "@chakra-ui/react";
import { generatorArrayEmpty } from "../../utils/generatorArrayEmpty";
import "./index.css";
import { ITileMap } from "../../types/ITilesMap";
import React, { useState, useEffect } from "react";
import { boundaryChecker } from "../../utils/boundaryChecker";

interface IGeneratorGridInput {
  setTilesMap: React.Dispatch<React.SetStateAction<ITileMap[]>>;
  editorSelected: string;
  tilesMap: ITileMap[];
}

interface IGeneratorTilesInput {
  row: number;
  column: number;
  tilesMap: ITileMap[];
  editorSelected: string;
  setTilesMap: React.Dispatch<React.SetStateAction<ITileMap[]>>;
}

const GeneratorTiles = ({
  row,
  column,
  setTilesMap,
  tilesMap,
  editorSelected,
}: IGeneratorTilesInput): JSX.Element => {
  const [startTileIndex, setStartTileIndex] = useState<number>(126);
  const [endTileIndex, setEndTileIndex] = useState<number>(29);
  const [tilesBlocked, setTilesBlocked] = useState<string[]>([
    "16",
    "26",
    "36",
    "43",
    "53",
    "63",
    "44",
    "45",
    "46",
    "65",
    "73",
    "75",
    "85",
    "95",
    "94",
    "104",
  ]);
  const tilesCount = column * row;

  useEffect(() => {
    const tiles = generatorArrayEmpty(tilesCount).map((_, index) => {
      const rowIndex = Math.floor(index / column);
      const columnIndex = index % column;
      const tilesIndex = `${rowIndex}${columnIndex}`;

      const isBlock =
        ![endTileIndex, startTileIndex].includes(index) &&
        (boundaryChecker(index, tilesCount, row) ||
          tilesBlocked.includes(tilesIndex));

      const tilesOptions = {
        coord: [rowIndex, columnIndex],
        index: tilesIndex,
        isBlock,
        isEnd: endTileIndex === index,
        isStart: startTileIndex === index,
      };

      return tilesOptions;
    });

    setTilesMap(tiles);
  }, [startTileIndex, endTileIndex, tilesBlocked]);

  return (
    <>
      {tilesMap.map((tilesOptions, i) => {
        const color =
          tilesOptions.background ||
          (tilesOptions.isBlock ? "#252a34" : "#d3d6db");

        return (
          <GridItem
            key={i}
            w="10"
            h="10"
            bg={color}
            onClick={() => {
              console.log(editorSelected);
              if (!tilesOptions.isBlock) {
                switch (editorSelected) {
                  case "start":
                    setStartTileIndex(i);
                    break;
                  case "goal":
                    setEndTileIndex(i);
                    break;
                  case "block":
                    setTilesBlocked([...tilesBlocked, tilesOptions.index]);
                    break;
                  default:
                    break;
                }
              } else {
                setTilesBlocked(
                  tilesBlocked.filter((t) => t !== tilesOptions.index)
                );
              }

              setTilesMap((oldTiles) => {
                return oldTiles.map((tile, i) => ({
                  ...tile,
                  isStart: i === i,
                }));
              });
            }}
          >
            <Center>
              {startTileIndex === i && <Text fontSize={22}> S </Text>}
              {tilesOptions.isEnd && <Text fontSize={22}> G </Text>}
            </Center>
          </GridItem>
        );
      })}
    </>
  );
};

export const GeneratorGrid = ({
  setTilesMap,
  tilesMap,
  editorSelected,
}: IGeneratorGridInput): JSX.Element => {
  return (
    <>
      <Grid templateColumns="repeat(12, 1fr)" gap={1}>
        {GeneratorTiles({
          editorSelected,
          row: 12,
          column: 12,
          setTilesMap,
          tilesMap,
        })}
      </Grid>
    </>
  );
};
