import { useState } from 'react'
import Home from './pages/Home'
import Layout from './components/Layout'
import CreateProjectForm from './forms/CreateProjectForm'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterForm from './forms/RegisterForm';
import CollaborationRequests from './pages/CollaborationRequests';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-project" element={<CreateProjectForm />} />
          <Route path="/register" element={<RegisterForm />} />
          {/* <Route path="/login" element={<LoginForm />} /> */}
          <Route path="/collaboration-requests" element={<CollaborationRequests />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App