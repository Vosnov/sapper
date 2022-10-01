import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Difficult, Sapper } from './logic/sapper';
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

  useEffect(() => {
    fieldImage.onload = () => {
      numbersImage.onload = () => {
        setImageIsLoaded(true)
      }
    }
  }, [])

  useEffect(() => {
    if (!ref.current || !imageIsLoaded) return

    const sapper = new Sapper(ref.current, Difficult.Hard)
    sapper.draw()
    setSapper(sapper)

  }, [ref, imageIsLoaded])

  useEffect(() => {
    if (!ref2.current || !sapper) return
    
    ref2.current.width = sapper.width + 40
    ref2.current.height = sapper.height + 140

    const border = new Border(ref2.current)
    border.draw()
  }, [ref2, sapper])

  return (
    <div className="App">
      <canvas className='sapper_interface' width={400} height={500} ref={ref2}/>
      <canvas className='sapper_body' width={400} height={400} ref={ref}/>
    </div>
  );
}

export default App;
