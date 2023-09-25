import { useState } from 'react'
import {GeneratorGrid} from './components/Grid' 
 
import './App.css'
import { Button, Center } from '@chakra-ui/react'
import { ITileMap } from './types/ITilesMap'
import { algorithmSelector } from './classes/algorithmSelector'


function App() {
  const [tilesMap, setTilesMaps ] = useState<ITileMap[]>([])

  const startAlgorithm = (tiles: ITileMap[]) => {
    const AlgorithmBuild = algorithmSelector('aStarSearch', tiles)

    AlgorithmBuild.start()
  }

  return (
    <>
       <Center> 
          <GeneratorGrid setTilesMap={setTilesMaps} tilesMap={tilesMap}/>
          <Button onClick={() => startAlgorithm(tilesMap) } >
            teste
          </Button>
       </Center>
    </>
  )
}

export default App
