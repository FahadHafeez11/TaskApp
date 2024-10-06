"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Divider,
} from "@mui/material";
import DialogBar from "@/components/common/DialogBar"; // Shared dialog component
import Textfield from "@/components/common/Textfield"; // Shared input component

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskStatus, setTaskStatus] = useState("");

  const [userID, setuserID] = useState(localStorage.getItem('userId'));


  useEffect(() => {
    setuserID(localStorage.getItem('userId'))
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/tasks/getbyuserId/${userID}`);
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        setTasks(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleClose = () => {
    setIsMenuOpen(false);
    setIsEditMode(false);
    setSelectedTaskId(null);
  };

  const handleEdit = (task) => {
    setIsMenuOpen(true);
    setIsEditMode(true);
    setSelectedTaskId(task.id);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskDueDate(task.due_date);
    setTaskStatus(task.status);
  };

  const createTask = async () => {
    const newTask = {
      title: taskTitle,
      description: taskDescription,
      due_date: taskDueDate,
      status: taskStatus,
      userId: userID,
    };
  
    try {
      const response = await fetch("http://localhost:8080/api/v1/tasks/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create task");
      }
  
      const data = await response.json();
      setTasks((prevTasks) => [...prevTasks, data.data]); // Ensure you're appending to the previous state
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };
  
  const updateTask = async () => {
    const updatedTask = {
      title: taskTitle,
      description: taskDescription,
      due_date: taskDueDate,
      status: taskStatus,
    };
  
    try {
      const response = await fetch(`http://localhost:8080/api/v1/tasks/update/${selectedTaskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update task");
      }
  
      const updatedData = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === selectedTaskId ? updatedData.data : task))
      );
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/tasks/delete/${taskId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
  
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(err.message);
    }
  };
  

  const resetForm = () => {
    setTaskTitle("");
    setTaskDescription("");
    setTaskDueDate("");
    setTaskStatus("");
    setIsMenuOpen(false);
    setIsEditMode(false);
    setSelectedTaskId(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "end", padding: 2 }}>
        <Button variant="contained" color="primary" onClick={() => setIsMenuOpen(true)}>
          New Task
        </Button>
      </Box>
      <Divider />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.description}</TableCell>
                <TableCell>{task.due_date}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(task)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(task.id)}
                    style={{ marginLeft: "8px" }}
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
        title={isEditMode ? "Edit Task" : "New Task"}
        submitButtonLabel={isEditMode ? "Update Task" : "Create Task"}
        isOpen={isMenuOpen}
        onClose={handleClose}
        onSubmit={isEditMode ? updateTask : createTask}
      >
        <Textfield
          label="Task Title"
          placeholder="Enter task title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <Textfield
          label="Task Description"
          placeholder="Enter task description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />
        <Textfield
          label="Due Date"
          placeholder="Enter due date"
          value={taskDueDate}
          onChange={(e) => setTaskDueDate(e.target.value)}
        />
        <Textfield
          label="Task Status"
          placeholder="Enter task status"
          value={taskStatus}
          onChange={(e) => setTaskStatus(e.target.value)}
        />
      </DialogBar>
    </>
  );
};

export default Tasks;
