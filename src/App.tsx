import React, { useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import { Sapper } from './logic/sapper';
import { SpriteField, SpriteNumbers } from './assets';

export const fieldImage = new Image()
fieldImage.src = SpriteField
export const numbersImage = new Image()
numbersImage.src = SpriteNumbers

function App() {
  const ref = useRef<HTMLCanvasElement>(null)

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

  return (
    <div className="App">
      <canvas width={400} height={400} ref={ref}/>
    </div>
  );
}

export default App;
