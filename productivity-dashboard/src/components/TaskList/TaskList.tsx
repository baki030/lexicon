import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  IconButton,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon
} from '@mui/icons-material';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  projectId: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Complete project proposal', completed: true, dueDate: '2024-03-20', priority: 'high', projectId: '1' },
    { id: '2', title: 'Review code changes', completed: false, dueDate: '2024-03-21', priority: 'medium', projectId: '1' },
    { id: '3', title: 'Team meeting', completed: false, dueDate: '2024-03-22', priority: 'low', projectId: '2' },
  ]);

  const [newTask, setNewTask] = useState({
    title: '',
    dueDate: '',
    priority: 'medium' as const,
    projectId: '1'
  });

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        completed: false,
        dueDate: newTask.dueDate,
        priority: newTask.priority,
        projectId: newTask.projectId
      };
      setTasks([...tasks, task]);
      setNewTask({
        title: '',
        dueDate: '',
        priority: 'medium',
        projectId: '1'
      });
    }
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Task Management
      </Typography>

      {/* Add New Task Form */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              type="date"
              label="Due Date"
              InputLabelProps={{ shrink: true }}
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newTask.priority}
                label="Priority"
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddTask}
            >
              Add Task
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Task List */}
      <Paper>
        <List>
          {tasks.map((task) => (
            <ListItem
              key={task.id}
              secondaryAction={
                <Box>
                  <IconButton edge="end" aria-label="edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTask(task.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id)}
                />
              </ListItemIcon>
              <ListItemText
                primary={task.title}
                secondary={`Due: ${new Date(task.dueDate).toLocaleDateString()} | Priority: ${task.priority}`}
                sx={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: task.completed ? 'text.secondary' : 'text.primary'
                }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default TaskList; 