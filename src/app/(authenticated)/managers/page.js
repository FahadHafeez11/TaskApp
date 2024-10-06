"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Box,
  TableHead,
  TableRow,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import DialogBar from "@/components/common/DialogBar";
import Textfield from "@/components/common/Textfield";
import { useRouter } from "next/navigation";

const managers = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isMenuOpen, setisMenuOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Flag for edit mode
  const [selectedManagerId, setSelectedManagerId] = useState(null); // Track selected manager ID

  const [managerName, setmanagerName] = useState("");
  const [managerEmail, setmanagerEmail] = useState("");
  const [managerPassword, setmanagerPassword] = useState("");
  const [assignUser, setassignUser] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/managers/get`); // Adjust API endpoint as necessary
        if (!response.ok) {
          throw new Error("Failed to fetch managers");
        }
        const data = await response.json();
        setManagers(data.data); // Assuming your API returns data in this structure
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchManagers();
  }, []);

  const handleClose = () => {
    setisMenuOpen(false);
    setIsEditMode(false); // Reset edit mode
    setSelectedManagerId(null); // Clear selected manager ID
  };

  const handleEdit = (managerId, username, email, password) => {
    setisMenuOpen(true);
    setIsEditMode(true); // Enable edit mode
    setSelectedManagerId(managerId); // Set the ID of the manager being edited
    setmanagerName(username);
    setmanagerEmail(email);
    setmanagerPassword(password);
  };

  const createManager = async () => {
    const newManager = {
      username: managerName,
      email: managerEmail,
      password: managerPassword,
      assignedUser: assignUser || "", // Assuming you're sending an assigned user as well
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1/managers/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newManager),
      });

      if (!response.ok) {
        throw new Error("Failed to create manager");
      }

      const data = await response.json();
      setManagers([...managers, data.data]); // Assuming API returns the newly created manager's data
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateManager = async () => {
    const updatedManager = {
      username: managerName,
      email: managerEmail,
      password: managerPassword,
    };

    try {
      const response = await fetch(`http://localhost:8080/api/v1/managers/update/${selectedManagerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedManager),
      });

      if (!response.ok) {
        throw new Error("Failed to update manager");
      }

      const updatedData = await response.json();
      setManagers((prev) =>
        prev.map((manager) => (manager.id === selectedManagerId ? updatedData.data : manager))
      );
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setmanagerName("");
    setmanagerEmail("");
    setmanagerPassword("");
    setassignUser("");
    setisMenuOpen(false);
    setIsEditMode(false);
    setSelectedManagerId(null);
  };

  const handleDelete = async (managerId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/managers/delete/${managerId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete manager");
      }

      setManagers((prev) => prev.filter((manager) => manager.id !== managerId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "end", padding: 2 }}>
        <Button variant="contained" color="primary" onClick={() => setisMenuOpen(true)}>
          New
        </Button>
      </Box>
      <Divider />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Manager Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Passwod</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {managers.map((manager) => (
              <TableRow key={manager.id}>
                <TableCell>{manager.id}</TableCell>
                <TableCell>{manager.username}</TableCell>
                <TableCell>{manager.email}</TableCell>
                <TableCell>****</TableCell>

                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => router.push("/managers/manager")}>
                    Users
                  </Button>
                  <Button variant="contained" color="primary" onClick={() => handleEdit(manager.id, manager.username, manager.email, manager.password)}>
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(manager.id)}
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
        title={isEditMode ? "Edit Manager" : "New Manager"}
        submitButtonLabel={isEditMode ? "Update Manager" : "Create Manager"}
        isOpen={isMenuOpen}
        onClose={handleClose}
        onSubmit={isEditMode ? updateManager : createManager} // Conditionally call create or update
      >
        <Textfield
          label="Manager Name"
          placeholder="Enter Manager name"
          value={managerName}
          onChange={(e) => setmanagerName(e.target.value)}
        />
        <Textfield
          label="Manager Email"
          placeholder="Enter Manager Email"
          value={managerEmail}
          onChange={(e) => setmanagerEmail(e.target.value)}
        />
        <Textfield
          label="Manager Password"
          placeholder="Enter Manager Password"
          value={managerPassword}
          onChange={(e) => setmanagerPassword(e.target.value)}
        />
      </DialogBar>
    </>
  );
};

export default managers;
