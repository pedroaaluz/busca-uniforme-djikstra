import { useState } from 'react'
import {GeneratorGrid} from './components/Grid' 
 
import './App.css'
import { Center } from '@chakra-ui/react'
import { ITileMap } from './types/ITilesMap'


function App() {

  const [tilesMap, setTilesMaps ] = useState<ITileMap[]>([])

  return (
    <>
       <Center> 
          <GeneratorGrid setTilesMap={setTilesMaps}/>
       </Center>
    </>
  )
}

export default App
