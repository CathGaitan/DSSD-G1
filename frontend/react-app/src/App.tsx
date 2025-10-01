import { useState } from 'react'
// import './App.css'  // ← COMENTA O ELIMINA ESTA LÍNEA
import Home from './pages/Home'
import Layout from './components/Layout'
import CreateProjectForm from './forms/CreateProjectForm'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-project" element={<CreateProjectForm />} />
          {/* <Route path="/login" element={<LoginForm />} /> */}
          {/* <Route path="/projects" element={<Projects />} /> */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App