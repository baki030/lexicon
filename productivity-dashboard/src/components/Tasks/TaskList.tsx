import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  projectId: string;
}

interface Project {
  id: string;
  name: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = React.useState<Task[]>([
    {
      id: '1',
      title: 'Complete project proposal',
      description: 'Write and submit the project proposal document',
      completed: true,
      dueDate: '2024-03-20',
      priority: 'high',
      projectId: '1'
    },
    {
      id: '2',
      title: 'Review code changes',
      description: 'Review pull requests and provide feedback',
      completed: false,
      dueDate: '2024-03-21',
      priority: 'medium',
      projectId: '1'
    },
    {
      id: '3',
      title: 'Team meeting',
      description: 'Weekly team sync meeting',
      completed: false,
      dueDate: '2024-03-22',
      priority: 'low',
      projectId: '2'
    }
  ]);

  const [projects] = React.useState<Project[]>([
    { id: '1', name: 'Work' },
    { id: '2', name: 'Personal' },
    { id: '3', name: 'Shopping' }
  ]);

  const [openDialog, setOpenDialog] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [newTask, setNewTask] = React.useState<Partial<Task>>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    projectId: ''
  });

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleOpenDialog = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setNewTask(task);
    } else {
      setEditingTask(null);
      setNewTask({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        projectId: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTask(null);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      projectId: ''
    });
  };

  const handleSaveTask = () => {
    if (editingTask) {
      setTasks(tasks.map(task =>
        task.id === editingTask.id ? { ...newTask as Task, id: task.id } : task
      ));
    } else {
      setTasks([...tasks, {
        ...newTask as Task,
        id: Date.now().toString(),
        completed: false
      }]);
    }
    handleCloseDialog();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Tasks</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Task
        </Button>
      </Box>

      <Paper>
        <List>
          {tasks.map((task) => (
            <ListItem
              key={task.id}
              divider
              sx={{
                backgroundColor: task.completed ? 'rgba(0, 0, 0, 0.04)' : 'inherit'
              }}
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
                secondary={
                  <Box component="span">
                    <Typography variant="body2" color="text.secondary">
                      {task.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <ScheduleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="caption" color="text.secondary">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handleOpenDialog(task)}
                  sx={{ mr: 1 }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleDeleteTask(task.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTask ? 'Edit Task' : 'Add New Task'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Title"
              fullWidth
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <TextField
              label="Due Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={newTask.priority}
                label="Priority"
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select
                value={newTask.projectId}
                label="Project"
                onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveTask} variant="contained">
            {editingTask ? 'Save Changes' : 'Add Task'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskList; 