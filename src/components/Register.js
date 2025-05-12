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

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при регистрации');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Регистрация
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Имя пользователя"
              name="username"
              variant="outlined"
              margin="normal"
              value={formData.username}
              onChange={handleChange}
              required
            />
            
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <TextField
              fullWidth
              label="Пароль"
              name="password"
              type="password"
              variant="outlined"
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              required
            />
            
            <TextField
              fullWidth
              label="Подтвердите пароль"
              name="confirmPassword"
              type="password"
              variant="outlined"
              margin="normal"
              value={formData.confirmPassword}
              onChange={handleChange}
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
              Зарегистрироваться
            </Button>
          </form>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link href="/login" variant="body2">
              Уже есть аккаунт? Войдите
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Register; 