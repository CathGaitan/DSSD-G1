import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import Layout from './components/Layout'
import CreateProjectForm from './forms/CreateProjectForm'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-project" element={<CreateProjectForm />} />
          {/* <Route path="/login" element={<LoginForm />} /> */}
          {/* <Route path="/projects" element={<Projects />} /> */}
          {/* Set other routes here */}
        </Routes>
      </Layout>
    </Router>

  );
}

export default App
