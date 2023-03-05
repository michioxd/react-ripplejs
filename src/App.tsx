import { useState } from 'react'
import './App.css';
import Ripple from "react-ripplejs";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>react-ripplejs</h1>
      <p>Vanilla Material Design Ripple Effect implement for ReactJS</p>
      <div className="card">
        <Ripple className='btn' onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Ripple>
        <br />
        <Ripple className='btn' background='#646cff' onClick={() => setCount((count) => count + 1)}>
          count is {count} but it purple
        </Ripple>
        <br />
        <Ripple className='btn' background='#646cff' opacity='0.8' onClick={() => setCount((count) => count + 1)}>
          count is {count} but it purple + opacity 0.8
        </Ripple>
      </div>
      <p className="read-the-docs">
        Made with &hearts; by <a href="https://github.com/michioxd">michioxd</a> - <a href="https://github.com/michioxd/react-ripplejs">Fork me on GitHub</a>
      </p>
    </div>
  )
}

export default App
