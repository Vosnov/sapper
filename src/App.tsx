import React, { useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import { Sapper } from './logic/sapper';
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

  useEffect(() => {
    if (!ref.current) return
    fieldImage.onload = () => {
      numbersImage.onload = () => {
        if (!ref.current) return
        const sapper = new Sapper(ref.current)
        sapper.draw()
      }
    }
  }, [ref])

  useEffect(() => {
    if (!ref2.current) return
    
    const border = new Border(ref2.current)
    border.draw()
  }, [ref2])

  return (
    <div className="App">
      <canvas className='sapper_interface' width={400} height={500} ref={ref2}/>
      <canvas className='sapper_body' width={400} height={400} ref={ref}/>
    </div>
  );
}

export default App;
