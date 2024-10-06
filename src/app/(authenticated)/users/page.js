"use client"
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, Box, TableHead, TableRow, Button, Paper, Divider } from '@mui/material';
import DialogBar from '@/components/common/DialogBar';
import Textfield from '@/components/common/Textfield';
import { useRouter } from 'next/navigation';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [editMode, setEditMode] = useState(false); // New state for tracking edit mode
  const [selectedUserId, setSelectedUserId] = useState(null); // Track the user being edited
  const [role, setrole]= useState(localStorage.getItem('Role'))

  const router = useRouter();

  useEffect(() => {
  setrole(localStorage.getItem('Role'))
    
    const fetchUsers = async () => {
      try {
        
        const response = await fetch(`http://localhost:8080/api/v1/users/get`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleClose = () => {
    setIsMenuOpen(false);
    setEditMode(false); // Reset the edit mode on close
  };

  const handleEdit = (userId, username, email, password) => {
    // Ensure userId is passed correctly
    if (!userId) {
      setError('Error: Invalid user ID');
      return;
    }

    // Set form state for editing
    setIsMenuOpen(true);
    setEditMode(true);
    setSelectedUserId(userId);  // Set user ID correctly
    setUserName(username);
    setUserEmail(email);
    setUserPassword(password);
  };

  const updateUser = async () => {
    if (!selectedUserId) {
      setError('Error: No user selected for update');
      return;
    }

    const updatedUser = {
      username: userName,
      email: userEmail,
      password: userPassword,
    };

    try {
      const response = await fetch(`http://localhost:8080/api/v1/users/update/${selectedUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const data = await response.json();
      console.log("Data is", data)
      // Update the user list without throwing an error
      setUsers((prev) => prev.map((user) => (user.id === selectedUserId ? data.data : user)));

      console.log("Data after user set", users)
      setIsMenuOpen(false);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    }
  };


  const createUser = async () => {
    const newUser = {
      username: userName,
      email: userEmail,
      password: userPassword,
      role: 'regular',
    };

    try {
      const response = await fetch('http://localhost:8080/api/v1/users/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      const data = await response.json();
      setUsers([...users, data.data]);
      setUserName('');
      setUserEmail('');
      setUserPassword('');
      setIsMenuOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/users/delete/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'end', padding: 2 }}>
        <Button variant="contained" color="primary" onClick={() => { setIsMenuOpen(true); setEditMode(false); }}>
          New
        </Button>
      </Box>
      <Divider />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>****</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => router.push(`/users/user?userId=${user.id}`)}>
                    Tasks
                  </Button>
                  <Button variant="contained" color="primary" onClick={() => handleEdit(user.id, user.username, user.email, user.password)}>
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <DialogBar
        title={editMode ? 'Edit User' : 'New User'}
        submitButtonLabel={editMode ? 'Update User' : 'Create User'}
        isOpen={isMenuOpen}
        onClose={handleClose}
        onSubmit={editMode ? updateUser : createUser}
      >
        <Textfield
          label="User Name"
          placeholder="Enter User name"
          value={userName}
          onChange={(e) => { setUserName(e.target.value); }}
        />
        <Textfield
          label="User Email"
          placeholder="Enter User Email"
          value={userEmail}
          onChange={(e) => { setUserEmail(e.target.value); }}
        />
        <Textfield
          label="User Password"
          placeholder="Enter User Password"
          value={userPassword}
          onChange={(e) => { setUserPassword(e.target.value); }}
        />
      </DialogBar>
    </>
  );
};

export default Users;
