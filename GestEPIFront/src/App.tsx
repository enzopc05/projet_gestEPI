import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import EPIList from './pages/EPIList';
import EPIDetail from './pages/EPIDetail';
import EPIForm from './pages/EPIForm';
import CheckList from './pages/CheckList';
import CheckDetail from './pages/CheckDetail';
import CheckForm from './pages/CheckForm';
import UserList from './pages/UserList'; // Importez le composant UserList
import UserForm from './pages/UserForm'; // Importez le composant UserForm
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Routes EPIs */}
          <Route path="/epis" element={<EPIList />} />
          <Route path="/epis/:id" element={<EPIDetail />} />
          <Route path="/epis/new" element={<EPIForm />} />
          <Route path="/epis/edit/:id" element={<EPIForm />} />
          
          {/* Routes Vérifications */}
          <Route path="/checks" element={<CheckList />} />
          <Route path="/checks/:id" element={<CheckDetail />} />
          <Route path="/checks/new" element={<CheckForm />} />
          <Route path="/checks/edit/:id" element={<CheckForm />} />
          
          {/* Routes Utilisateurs - Ajoutez ces routes */}
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:id" element={<UserForm />} />
          <Route path="/users/new" element={<UserForm />} />
          <Route path="/users/edit/:id" element={<UserForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;