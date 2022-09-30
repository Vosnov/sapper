import React, { useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import { Sapper } from './logic/sapper';

function App() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (ref.current) {
      const sapper = new Sapper(ref.current)
      sapper.draw()
    }
  }, [ref])

  return (
    <div className="App">
      <canvas width={400} height={400} ref={ref}/>
    </div>
  );
}

export default App;
