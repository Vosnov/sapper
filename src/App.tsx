import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { Difficult, difficultData, Sapper } from './logic/sapper';
import { SpriteField, SpriteNumbers, SpriteBorder } from './assets';
import { Border } from './logic/border';

export const fieldImage = new Image()
fieldImage.src = SpriteField
export const numbersImage = new Image()
numbersImage.src = SpriteNumbers
export const borderImage = new Image()
borderImage.src = SpriteBorder

function App() {
  const ref = useRef<HTMLCanvasElement>(null)
  const ref2 = useRef<HTMLCanvasElement>(null)
  const [imageIsLoaded, setImageIsLoaded] = useState(false)
  const [sapper, setSapper] = useState<Sapper>()
  const [selectedDifficult, setSelectedDifficult] = useState(Difficult.VeryEasy)

  useEffect(() => {
    fieldImage.onload = () => {
      numbersImage.onload = () => {
        setImageIsLoaded(true)
      }
    }
  }, [])

  useEffect(() => {
    if (!ref.current || !imageIsLoaded) return

    const sapper = new Sapper(ref.current, selectedDifficult)
    sapper.draw()
    setSapper(sapper)

    return () => sapper.clearInterval()
  }, [ref, imageIsLoaded, selectedDifficult])

  useEffect(() => {
    if (!ref2.current || !sapper) return
    
    ref2.current.width = sapper.width + 40
    ref2.current.height = sapper.height + 140

    const border = new Border(ref2.current)
    border.draw()
  }, [ref2, sapper])

  return (
    <div className="App">
      <select value={selectedDifficult} onChange={(e) => setSelectedDifficult(e.target.value as Difficult)} name="difficult" id="difficult">
        {Object.keys(difficultData).map(difficult => (
          <option key={difficult}>{difficult}</option>
        ))}
      </select>
      <div className='wrapper'>
        <canvas className='sapper_interface' width={400} height={500} ref={ref2}/>
        <canvas className='sapper_body' width={400} height={400} ref={ref}/>
      </div>
    </div>
  );
}

export default App;
