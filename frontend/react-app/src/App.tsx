import Home from './pages/Home'
import Layout from './components/Layout'
import CreateProjectForm from './forms/CreateProjectForm'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterForm from './forms/RegisterForm';
import LoginForm from './forms/LoginForm';
import ShowProjectsCloud from './pages/ShowProjectsCloud';
import ShowProjectsLocal from './pages/ShowProjectsLocal';
import Observations from './pages/Observations';
import SelectRequest from './pages/SelectRequest';
import ProtectedRoute from './components/ProtectedRoute'; // <-- IMPORTADO
import ShowCollaborationRequest from './pages/ShowCollaborationRequest';
import ShowObservationsManager from './pages/ShowObservationsManager';
import ShowObservationsONG from './pages/ShowObservationsONG';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/login" element={<LoginForm onLoginSuccess={(_token) => {
            window.location.href = "/";
          }} onRegister={() => {
            window.location.href = "/register";
          }} />} />
          
          <Route path="/create-project" element={<ProtectedRoute authTier="local"><CreateProjectForm /></ProtectedRoute>} />
          <Route path="/local-projects" element={<ProtectedRoute authTier="local"><ShowProjectsLocal /></ProtectedRoute>} />
          
          <Route path="/cloud-projects" element={<ProtectedRoute authTier="cloud"><ShowProjectsCloud /></ProtectedRoute>} />
          <Route path="/colaboration-requests" element={<ProtectedRoute authTier="cloud"><ShowCollaborationRequest /></ProtectedRoute>} />
          <Route path="/select-requests" element={<ProtectedRoute authTier="cloud"><SelectRequest /></ProtectedRoute>} />
          <Route path="/observations" element={<ProtectedRoute authTier="cloud"><Observations /></ProtectedRoute>} />
          <Route path="/show_obs_manager" element={<ProtectedRoute authTier="cloud"><ShowObservationsManager /></ProtectedRoute>} />
          <Route path="/show_obs_ong" element={<ProtectedRoute authTier="cloud"><ShowObservationsONG /></ProtectedRoute>} />

        </Routes>
      </Layout>
    </Router>
  );
}

export default App