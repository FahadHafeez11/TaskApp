"use client"
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Menu, MenuItem, IconButton, Avatar, CssBaseline } from '@mui/material';
import { useRouter } from 'next/navigation';

const NavBar = ({ onLogout }) => {
    const router = useRouter()
    const [anchorEl, setAnchorEl] = React.useState(null);
    const isOpen = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        localStorage.setItem('Role', null)
        router.push('/login')
    };
    return (
        <>
            <CssBaseline />

            <AppBar sx={{ zIndex: 1201, boxShadow: 'none' }}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Task Management System
                    </Typography>
                    {/* <Button color="inherit" onClick={onLogout}>Logout</Button> */}
                    <IconButton onClick={handleClick}>
                        <Avatar sx={{ width: 32, height: 32 }} />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={isOpen}
                onClose={handleClose}
                onClick={handleClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >

                <MenuItem onClick={handleLogout}>
                    {/* <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon> */}
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
};

export default NavBar;
