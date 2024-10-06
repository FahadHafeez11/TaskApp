'use client'

import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const [Error, setError] = useState('')

  useEffect(() => {
    const role = localStorage.getItem('Role')
    if (role == 'admin') {
      router.push('/managers')
    }
    else if (role == 'manager') {
      router.push('/users')
    }
    else if (role == 'regular') {
      router.push('/tasks')
    }
  })

  const submitHandler = async (e) => {
    e.preventDefault();
    setError('');  // Clear previous error message
  
    try {
      // Admin check first
      if (email === 'admin11@gmail.com' && password === '12345678') {
        localStorage.setItem('Role', 'admin');
        router.push('/managers'); // Redirect to admin dashboard
        return;  // Stop further execution
      }
  
      // Fetch users from API
      const userResponse = await fetch('http://localhost:8080/api/v1/users/get');
      if (!userResponse.ok) {
        throw new Error('Failed to fetch users');
      }
      const usersData = await userResponse.json();
  
      // Find a matched user in the users data
      const matchedUser = usersData.data.find(user => user.email === email && user.password === password);
  
      if (matchedUser) {
        // If a user match is found, set role as 'user' and redirect to the appropriate page
        localStorage.setItem('Role', 'regular');
        localStorage.setItem('userId', matchedUser.id);

        router.push('/tasks'); // Redirect to user dashboard (for example)
      } else {
        // If no user match, fetch managers data
        const managerResponse = await fetch('http://localhost:8080/api/v1/managers/get');
        if (!managerResponse.ok) {
          throw new Error('Failed to fetch managers');
        }
        const managersData = await managerResponse.json();
  
        // Find a matched manager in the managers data
        const matchedManager = managersData.data.find(manager => manager.email === email && manager.password === password);
  
        if (matchedManager) {
          // If a manager match is found, set role as 'manager' and redirect to the appropriate page
          localStorage.setItem('Role', 'manager');
          router.push('/users'); // Redirect to manager dashboard (for example)
        } else {
          // If no match is found in both users and managers, show an error
          setError('Invalid email or password');
        }
      }
  
    } catch (err) {
      console.error(err);  // Log the exact error for debugging
      setError('Something went wrong. Please try again.');
    }
  };
  
  

  return (
    // <Box padding='10%'>

    //   <Box gap={2} display="flex" flexDirection="column" >
    //     <Typography variant="display_sm" fontWeight="bold">
    //       Login to Task management system
    //     </Typography>

    //     <TextField
    //       label="EMAIL ADDRESS"
    //       placeholder="Enter email"
    //       value={email}
    //       onChange={(e) => setEmail(e.target.value)}
    //     />
    //     <TextField
    //       label="PASSWORD"
    //       placeholder="Password"
    //       helperText={Error}
    //       type="password"
    //       value={password}
    //       onChange={(e) => setPassword(e.target.value)}
    //     />
    //     <Button variant="contained" color="primary" type="submit" onClick={submitHandler}>
    //       Login
    //     </Button>


    //   </Box>
    // </Box>

    <Box display="flex" flexDirection="column" gap={4} margin='150px'>
      <Typography variant="h3" fontWeight="bold">
          Login to Task management system
        </Typography>

        <TextField
          label="EMAIL ADDRESS"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="PASSWORD"
          placeholder="Password"
          helperText={Error}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" type="submit" onClick={submitHandler}>
          Login
        </Button>
    </Box>
  )
}

export default login
