import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import WordList from './components/ListWords.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <div>
          <h1>Words</h1>
          <WordList />
        </div>
    </>
  )
}

export default App
