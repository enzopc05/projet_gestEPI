import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import EPIList from './pages/EPIList';
import EPIDetail from './pages/EPIDetail';
import EPIForm from './pages/EPIForm';
import CheckList from './pages/CheckList';
import CheckDetail from './pages/CheckDetail';
import CheckForm from './pages/CheckForm';
import UserList from './pages/UserList';
import UserForm from './pages/UserForm';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            {/* Routes publiques */}
            <Route path="/login" element={<Login />} />
            
            {/* Routes protégées - accessible à tous les utilisateurs connectés */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Routes EPIs - accessibles aux administrateurs et vérificateurs */}
              <Route element={<ProtectedRoute requiredRoles={['admin', 'verificateur']} />}>
                <Route path="/epis" element={<EPIList />} />
                <Route path="/epis/:id" element={<EPIDetail />} />
              </Route>
              
              {/* Routes création/modification EPIs - accessibles uniquement aux administrateurs */}
              <Route element={<ProtectedRoute requiredRoles={['admin']} />}>
                <Route path="/epis/new" element={<EPIForm />} />
                <Route path="/epis/edit/:id" element={<EPIForm />} />
              </Route>
              
              {/* Routes Vérifications - accessibles aux administrateurs et vérificateurs */}
              <Route element={<ProtectedRoute requiredRoles={['admin', 'verificateur']} />}>
                <Route path="/checks" element={<CheckList />} />
                <Route path="/checks/:id" element={<CheckDetail />} />
                <Route path="/checks/new" element={<CheckForm />} />
                <Route path="/checks/edit/:id" element={<CheckForm />} />
              </Route>
              
              {/* Routes Utilisateurs - gestion accessible uniquement aux administrateurs */}
              <Route element={<ProtectedRoute requiredRoles={['admin']} />}>
                <Route path="/users" element={<UserList />} />
                <Route path="/users/new" element={<UserForm />} />
                <Route path="/users/edit/:id" element={<UserForm />} />
              </Route>
              
              {/* Route détail utilisateur - chaque utilisateur peut voir son propre profil */}
              <Route path="/users/:id" element={<UserForm />} />
            </Route>
            
            {/* Redirection vers la page de connexion pour toute autre route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;