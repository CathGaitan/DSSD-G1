import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import Layout from './components/Layout'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Layout>
      <Home />
    </Layout>

  );
}

export default App
