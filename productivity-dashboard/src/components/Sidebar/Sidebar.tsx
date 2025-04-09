import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  ListItemButton,
  Divider,
  Box,
  Typography,
  IconButton,
  Collapse
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as TaskIcon,
  Folder as ProjectIcon,
  ExpandLess,
  ExpandMore,
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  tasks: number;
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = React.useState<Project[]>([
    { id: '1', name: 'Work', tasks: 5 },
    { id: '2', name: 'Personal', tasks: 3 },
    { id: '3', name: 'Shopping', tasks: 2 }
  ]);
  const [openProjects, setOpenProjects] = React.useState(true);

  const toggleProjects = () => {
    setOpenProjects(!openProjects);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Productivity Dashboard
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            selected={isActive('/')}
            onClick={() => navigate('/')}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton 
            selected={isActive('/tasks')}
            onClick={() => navigate('/tasks')}
          >
            <ListItemIcon>
              <TaskIcon />
            </ListItemIcon>
            <ListItemText primary="Tasks" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={toggleProjects}>
          <ListItemIcon>
            <ProjectIcon />
          </ListItemIcon>
          <ListItemText primary="Projects" />
          {openProjects ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openProjects} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {projects.map((project) => (
              <ListItemButton 
                key={project.id} 
                sx={{ pl: 4 }}
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <ListItemText 
                  primary={project.name}
                  secondary={`${project.tasks} tasks`}
                />
              </ListItemButton>
            ))}
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="New Project" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
};

export default Sidebar; 