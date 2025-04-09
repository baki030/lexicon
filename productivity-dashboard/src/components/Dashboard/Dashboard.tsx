import React from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Flag as FlagIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  projectId: string;
}

interface Project {
  id: string;
  name: string;
  tasks: number;
}

const Dashboard: React.FC = () => {
  const [tasks] = React.useState<Task[]>([
    { id: '1', title: 'Complete project proposal', completed: true, dueDate: '2024-03-20', priority: 'high', projectId: '1' },
    { id: '2', title: 'Review code changes', completed: false, dueDate: '2024-03-21', priority: 'medium', projectId: '1' },
    { id: '3', title: 'Team meeting', completed: false, dueDate: '2024-03-22', priority: 'low', projectId: '2' },
    { id: '4', title: 'Update documentation', completed: true, dueDate: '2024-03-23', priority: 'medium', projectId: '1' },
    { id: '5', title: 'Bug fix', completed: true, dueDate: '2024-03-24', priority: 'high', projectId: '1' },
  ]);

  const [projects] = React.useState<Project[]>([
    { id: '1', name: 'Work', tasks: 5 },
    { id: '2', name: 'Personal', tasks: 3 },
    { id: '3', name: 'Shopping', tasks: 2 }
  ]);

  // Calculate statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionRate = (completedTasks / totalTasks) * 100;

  const priorityStats = {
    high: tasks.filter(task => task.priority === 'high').length,
    medium: tasks.filter(task => task.priority === 'medium').length,
    low: tasks.filter(task => task.priority === 'low').length
  };

  const projectStats = projects.map(project => ({
    name: project.name,
    completed: tasks.filter(task => task.projectId === project.id && task.completed).length,
    total: tasks.filter(task => task.projectId === project.id).length
  }));

  // Chart data for task completion
  const completionChartData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [completedTasks, totalTasks - completedTasks],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for priority distribution
  const priorityChartData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Tasks by Priority',
        data: [priorityStats.high, priorityStats.medium, priorityStats.low],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart data for project progress
  const projectChartData = {
    labels: projectStats.map(stat => stat.name),
    datasets: [
      {
        label: 'Completed Tasks',
        data: projectStats.map(stat => stat.completed),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Total Tasks',
        data: projectStats.map(stat => stat.total),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box sx={{ 
      flexGrow: 1, 
      p: 3,
      height: '100%',
      overflow: 'auto',
      backgroundColor: '#f5f5f5'
    }}>
      <Grid container spacing={3} sx={{ height: '100%' }}>
        {/* Task Progress Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Task Progress
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexGrow: 1 }}>
              <TrendingUpIcon color="primary" sx={{ mr: 1, fontSize: 40 }} />
              <Typography variant="h4">{Math.round(completionRate)}%</Typography>
            </Box>
            <LinearProgress variant="determinate" value={completionRate} sx={{ height: 10, borderRadius: 5 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {completedTasks} of {totalTasks} tasks completed
            </Typography>
          </Paper>
        </Grid>

        {/* Priority Distribution Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Priority Distribution
            </Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box sx={{ height: '60%', display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Doughnut data={priorityChartData} options={chartOptions} />
              </Box>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <FlagIcon color="error" />
                  </ListItemIcon>
                  <ListItemText primary={`High Priority: ${priorityStats.high} tasks`} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <FlagIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText primary={`Medium Priority: ${priorityStats.medium} tasks`} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <FlagIcon color="success" />
                  </ListItemIcon>
                  <ListItemText primary={`Low Priority: ${priorityStats.low} tasks`} />
                </ListItem>
              </List>
            </Box>
          </Paper>
        </Grid>

        {/* Project Progress Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Project Progress
            </Typography>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box sx={{ height: '60%', display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Bar data={projectChartData} options={barChartOptions} />
              </Box>
              <List dense>
                {projectStats.map((stat, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <AssignmentIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={`${stat.name}: ${stat.completed}/${stat.total} tasks`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Paper>
        </Grid>

        {/* Due Soon Card */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Due Soon
            </Typography>
            <List sx={{ flexGrow: 1 }}>
              {tasks
                .filter(task => !task.completed)
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .slice(0, 3)
                .map(task => (
                  <ListItem key={task.id}>
                    <ListItemIcon>
                      <ScheduleIcon color="warning" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={task.title}
                      secondary={`Due: ${new Date(task.dueDate).toLocaleDateString()}`}
                    />
                  </ListItem>
                ))}
            </List>
          </Paper>
        </Grid>

        {/* Recently Completed Card */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Recently Completed
            </Typography>
            <List sx={{ flexGrow: 1 }}>
              {tasks
                .filter(task => task.completed)
                .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
                .slice(0, 3)
                .map(task => (
                  <ListItem key={task.id}>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={task.title}
                      secondary={`Completed on: ${new Date(task.dueDate).toLocaleDateString()}`}
                    />
                  </ListItem>
                ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 