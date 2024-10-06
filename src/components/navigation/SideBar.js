"use client"
import React, { useEffect, useState } from 'react';
import { Drawer, List, ListItem, Toolbar, Typography, ListItemIcon, ListItemButton } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useRouter } from 'next/navigation'



const SideBar = () => {
  const router = useRouter()
  const [role, setrole]= useState(localStorage.getItem('Role'))
  useEffect(()=>{
  setrole(localStorage.getItem('Role'))
  },[])

  const getMenuItems = () => {
    switch (role) {
      case 'admin':
        return [
          { text: 'Managers', icon: <PeopleIcon />, href: '/managers' },
          { text: 'Users', icon: <PeopleIcon />, href: '/users' },
        ];
      case 'manager':
        return [
          { text: 'Assigned Users', icon: <PeopleIcon />, href: '/users' },
          { text: 'Tasks', icon: <AssignmentIcon />, href: '/tasks' },
        ];
      case 'regular':
        return [
          { text: 'Tasks', icon: <AssignmentIcon />, href: '/tasks' },
        ];
      default:
        return [];
    }
  };

  return (
    <Drawer 
    variant="permanent" 
    anchor="left" 
    sx={{width: '280px', flexShrink: 0,
        '& .MuiDrawer-paper': {
            width: '280px',
            boxSizing: 'border-box',
          },
    }} 
    >
        <Toolbar />
      <List>
        {getMenuItems().map((item, index) => (
          <ListItem button key={index} >
            <ListItemButton onClick={()=>{router.push(item.href)}}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <Typography variant="label_md" fontWeight="bold">
                  {item.text}
                </Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default SideBar;
