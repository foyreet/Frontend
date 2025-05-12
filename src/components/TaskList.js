import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Chip,
  Pagination,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import axios from 'axios';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [open, setOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [comment, setComment] = useState('');

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/tasks?page=${page}&size=10`, {
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
  }, [page]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8080/api/tasks/${taskId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleAddComment = async () => {
    if (!currentTask || !comment.trim()) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8080/api/tasks/${currentTask.id}/comments`,
        { content: comment },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setCommentOpen(false);
      setComment('');
      fetchTasks();
    } catch (error) {
      console.error('Error adding comment:', error);
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
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Мои задачи
      </Typography>

      <Paper elevation={3}>
        <List>
          {tasks.map((task) => (
            <ListItem
              key={task.id}
              sx={{
                borderBottom: '1px solid #eee',
                '&:last-child': { borderBottom: 'none' }
              }}
            >
              <ListItemText
                primary={task.title}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {task.description}
                    </Typography>
                    {task.comments && task.comments.length > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        Комментарии: {task.comments.length}
                      </Typography>
                    )}
                  </>
                }
              />
              <ListItemSecondaryAction>
                <Chip
                  label={task.status}
                  color={task.status === 'COMPLETED' ? 'success' : 'default'}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <IconButton
                  edge="end"
                  onClick={() => {
                    setCurrentTask(task);
                    setCommentOpen(true);
                  }}
                >
                  <CommentIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleStatusChange(task.id, 'COMPLETED')}
                  disabled={task.status === 'COMPLETED'}
                >
                  <EditIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page + 1}
          onChange={(e, value) => setPage(value - 1)}
          color="primary"
        />
      </Box>

      <Dialog open={commentOpen} onClose={() => setCommentOpen(false)}>
        <DialogTitle>Добавить комментарий</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Комментарий"
            fullWidth
            multiline
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCommentOpen(false)}>Отмена</Button>
          <Button onClick={handleAddComment} variant="contained" color="primary">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default TaskList; 