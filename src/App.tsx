import { useState } from "react";
import { GeneratorGrid } from "./components/Grid";
import {
  AddIcon,
  WarningTwoIcon,
  EditIcon,
  NotAllowedIcon,
  StarIcon,
  UpDownIcon,
  Search2Icon,
} from "@chakra-ui/icons";

import "./App.css";
import {
  Button,
  Container,
  VStack,
  Box,
  Text,
  Center,
  Alert,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  HStack,
} from "@chakra-ui/react";
import { ITileMap } from "./types/ITilesMap";
import { algorithmSelector } from "./classes/algorithmSelector";

function App() {
  const [tilesMap, setTilesMaps] = useState<ITileMap[]>([]);
  const [algorithmSelected, setAlgorithmSelected] =
    useState<string>("bilateral");
  const [editorSelected, setEditorEdit] = useState<string>("start");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const translatorEditor: Record<string, string> = {
    start: "Início",
    goal: "Meta",
    block: "Obstáculo",
  };

  const translatorAlgorithm: Record<string, string> = {
    bilateral: "Bilateral",
    aStarSearch: "A*",
  };

  const startAlgorithm = (tiles: ITileMap[]) => {
    const AlgorithmBuild = algorithmSelector(algorithmSelected, tiles);
    setShowAlert(false);
    try {
      const tilesFindInAlgorithm = AlgorithmBuild.start();

      setTilesMaps(tilesFindInAlgorithm);
    } catch (error) {
      console.error(error);
      setShowAlert(true);
    }
  };

  return (
    <>
      <VStack spacing="10px">
        <Container maxW="container.sm" centerContent justifyItems={"center"}>
          <Box w={"100%"}>
            <Center marginBottom={5}>
              <Text as="b" color={"#252a34"} fontSize={"2xl"}>
                Selecione seu algotimo
              </Text>
            </Center>
            <HStack>
              <Menu>
                <MenuButton
                  as={Button}
                  aria-label="Options"
                  minW={60}
                  maxW={80}
                  variant="outline"
                >
                  <HStack justifyContent={"center"}>
                    <EditIcon />
                    <Text>{translatorEditor[editorSelected]}</Text>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem
                    icon={<AddIcon />}
                    onClick={() => setEditorEdit("start")}
                  >
                    Início
                  </MenuItem>
                  <MenuItem
                    icon={<StarIcon />}
                    onClick={() => setEditorEdit("goal")}
                  >
                    Meta
                  </MenuItem>
                  <MenuItem
                    icon={<NotAllowedIcon />}
                    onClick={() => setEditorEdit("block")}
                  >
                    Obstáculo
                  </MenuItem>
                </MenuList>
              </Menu>
              <Menu>
                <MenuButton
                  as={Button}
                  aria-label="Options"
                  minW={60}
                  maxW={80}
                  variant="outline"
                >
                  <HStack justifyContent={"center"}>
                    <Search2Icon />
                    <Text>{translatorAlgorithm[algorithmSelected]}</Text>
                  </HStack>
                </MenuButton>
                <MenuList>
                  <MenuItem
                    icon={<UpDownIcon />}
                    onClick={() => setAlgorithmSelected("bilateral")}
                  >
                    Bilateral
                  </MenuItem>
                  <MenuItem
                    icon={<UpDownIcon />}
                    onClick={() => setAlgorithmSelected("aStarSearch")}
                  >
                    A*
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Box>
        </Container>

        <Button
          marginY={10}
          onClick={() => {
      
            startAlgorithm(tilesMap);
          }}
        >
          Iniciar busca
        </Button>

        {showAlert && (
          <Alert status="error">
            <WarningTwoIcon color={"#F47070"} marginRight={5} />
            Possivel erro de configuração de mapa!
          </Alert>
        )}
        <GeneratorGrid
          setTilesMap={setTilesMaps}
          editorSelected={editorSelected}
          tilesMap={tilesMap}
        />
      </VStack>
    </>
  );
}

export default App;
