import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import {
  Assignment as TaskIcon,
  AdminPanelSettings as AdminIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

function Navbar({ isAuthenticated, isAdmin }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Система управления задачами
        </Typography>
        
        {isAuthenticated && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              color="inherit"
              startIcon={<TaskIcon />}
              onClick={() => navigate('/tasks')}
            >
              Задачи
            </Button>
            
            {isAdmin && (
              <Button
                color="inherit"
                startIcon={<AdminIcon />}
                onClick={() => navigate('/admin')}
              >
                Админ панель
              </Button>
            )}
            
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Выйти
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 