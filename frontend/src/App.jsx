import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import WordList from './components/ListWords.jsx';
import ReviewWords from './components/ReviewWords.jsx';
import Navbar from './components/Navbar.jsx';
import Progress from './components/Progress.jsx';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar />
    <main>
    <Routes>
      <Route path='/' element={<WordList />} />
      <Route path='review/' element={<ReviewWords />} />
      <Route path='progress/' element={<Progress />} />
    </Routes>
    </main>
    </>
  )
}

export default App
