import { useState } from 'react'
import Home from './pages/Home'
import Layout from './components/Layout'
import CreateProjectForm from './forms/CreateProjectForm'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterForm from './forms/RegisterForm';
import LoginForm from './forms/LoginForm';
import ShowProjectsCloud from './pages/ShowProjectsCloud';
import ShowProjectsLocal from './pages/ShowProjectsLocal';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-project" element={<CreateProjectForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm onLoginSuccess={(token) => {
            localStorage.setItem("token", token);
            window.location.href = "/";
          }} onRegister={() => {
            window.location.href = "/register";
          }} />} />
          {/* <Route path="/projects" element={<Projects />} /> */}
          {/* <Route path="/login" element={<LoginForm />} /> */}
          <Route path="/cloud-projects" element={<ShowProjectsCloud />} />
          <Route path="/local-projects" element={<ShowProjectsLocal />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App