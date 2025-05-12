import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Link,
} from '@mui/material';
import axios from 'axios';

function Login({ setIsAuthenticated, setIsAdmin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/signin', {
        email,
        password,
      });
      
      localStorage.setItem('token', response.data.token);
      setIsAuthenticated(true);
      setIsAdmin(response.data.role === 'ADMIN');
      navigate('/tasks');
    } catch (err) {
      setError('Неверный email или пароль');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Вход в систему
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <TextField
              fullWidth
              label="Пароль"
              type="password"
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
            >
              Войти
            </Button>
          </form>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link href="/register" variant="body2">
              Нет аккаунта? Зарегистрируйтесь
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login; 