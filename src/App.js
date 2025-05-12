import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './components/Login';
import Register from './components/Register';
import TaskList from './components/TaskList';
import AdminPanel from './components/AdminPanel';
import Navbar from './components/Navbar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar isAuthenticated={isAuthenticated} isAdmin={isAdmin} />
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setIsAdmin={setIsAdmin} />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/tasks" 
            element={isAuthenticated ? <TaskList /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin" 
            element={isAdmin ? <AdminPanel /> : <Navigate to="/tasks" />} 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 