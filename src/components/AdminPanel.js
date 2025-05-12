import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Chip,
  CircularProgress,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import axios from 'axios';

function AdminPanel() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [open, setOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState({
    title: '',
    description: '',
    assigneeEmail: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterEmail, setFilterEmail] = useState('');

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      let url = `http://localhost:8080/api/tasks?page=${page}&size=10`;
      
      if (filterType === 'author' && filterEmail) {
        url = `http://localhost:8080/api/tasks?authorEmail=${filterEmail}&page=${page}&size=10`;
      } else if (filterType === 'assignee' && filterEmail) {
        url = `http://localhost:8080/api/tasks?assigneeEmail=${filterEmail}&page=${page}&size=10`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, filterType, filterEmail]);

  const handleOpen = (task = null) => {
    if (task) {
      setCurrentTask(task);
      setIsEditing(true);
    } else {
      setCurrentTask({
        title: '',
        description: '',
        assigneeEmail: '',
      });
      setIsEditing(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentTask({
      title: '',
      description: '',
      assigneeEmail: '',
    });
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (isEditing) {
        await axios.put(
          `http://localhost:8080/api/tasks/${currentTask.id}`,
          currentTask,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } else {
        await axios.post(
          'http://localhost:8080/api/tasks',
          currentTask,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }
      handleClose();
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8080/api/tasks/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Управление задачами
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Добавить задачу
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200, mr: 2 }}>
          <InputLabel>Фильтр</InputLabel>
          <Select
            value={filterType}
            label="Фильтр"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="all">Все задачи</MenuItem>
            <MenuItem value="author">По автору</MenuItem>
            <MenuItem value="assignee">По исполнителю</MenuItem>
          </Select>
        </FormControl>
        {(filterType === 'author' || filterType === 'assignee') && (
          <TextField
            label="Email"
            value={filterEmail}
            onChange={(e) => setFilterEmail(e.target.value)}
            sx={{ minWidth: 300 }}
          />
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Название</TableCell>
              <TableCell>Описание</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Исполнитель</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>
                  <Chip
                    label={task.status}
                    color={task.status === 'COMPLETED' ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{task.assigneeEmail}</TableCell>
                <TableCell>
                  <IconButton
                    edge="end"
                    onClick={() => handleOpen(task)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={() => handleDelete(task.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={(e, value) => setPage(value - 1)}
          color="primary"
        />
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {isEditing ? 'Редактировать задачу' : 'Новая задача'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название"
            fullWidth
            value={currentTask.title}
            onChange={(e) =>
              setCurrentTask({ ...currentTask, title: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Описание"
            fullWidth
            multiline
            rows={4}
            value={currentTask.description}
            onChange={(e) =>
              setCurrentTask({ ...currentTask, description: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Email исполнителя"
            type="email"
            fullWidth
            value={currentTask.assigneeEmail}
            onChange={(e) =>
              setCurrentTask({ ...currentTask, assigneeEmail: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {isEditing ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AdminPanel; 