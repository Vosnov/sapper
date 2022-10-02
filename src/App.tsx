import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { Difficult, difficultData} from './logic/sapper';
import { SpriteField, SpriteNumbers, SpriteBorder, SpriteScoreboard } from './assets';
import { Game } from './logic/game';

export const fieldImage = new Image()

export const numbersImage = new Image()

export const borderImage = new Image()

export const scoreboardImage = new Image()

borderImage.src = SpriteBorder
fieldImage.src = SpriteField
numbersImage.src = SpriteNumbers
scoreboardImage.src = SpriteScoreboard

function App() {
  const ref = useRef<HTMLCanvasElement>(null)
  const ref2 = useRef<HTMLCanvasElement>(null)
  const [imageIsLoaded, setImageIsLoaded] = useState(0)
  const [selectedDifficult, setSelectedDifficult] = useState(Difficult.VeryEasy)

  useEffect(() => {
    [borderImage, fieldImage, numbersImage, scoreboardImage].forEach((image) => {
      if (image.complete) setImageIsLoaded(prevState => prevState + 1)
      else {
        image.onload = () => setImageIsLoaded(prevState => prevState + 1)
      }
    })
  }, [])

  useEffect(() => {
    if (!ref2.current || !ref.current) return
    if (imageIsLoaded !== 4) return
    const game = new Game(ref.current, ref2.current, selectedDifficult)
    
    return () => game.removeListeners()
  }, [ref2, ref, imageIsLoaded, selectedDifficult])

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
