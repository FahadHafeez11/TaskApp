"use client"
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
    //   const [users, setusers] = useState([]);
    const [role, setrole] = useState(localStorage.getItem('Role'));

    const router = useRouter();
    useEffect(() => {
        //     const fetchUsers = async () => {
        //         try {
        //           const response = await fetch(`http://localhost:8080/api/v1/users/get`); // Adjust API endpoint as necessary
        //           if (!response.ok) {
        //             throw new Error("Failed to fetch managers");
        //           }
        //           const data = await response.json();
        //           setusers(data.data); // Assuming your API returns data in this structure
        //           setrole(users.role)
        //         } catch (err) {
        //           setError(err.message);
        //         } finally {
        //           setLoading(false);
        //         }
        //       };

        //       fetchUsers();
        setrole(localStorage.getItem('Role'))
        if (!role == 'admin' || !role == 'manager' || !role == 'regular' || role == null) {
            router.push('/login')
        }
        else if (role == 'admin') {
            router.push('/managers')

        }
        else if (role == 'manager') {
            router.push('/users')

        }
        else if (role == 'regular') {
            router.push('/tasks')
        }

    }, [role])

    return (

        <Box sx={{ display: 'flex' }}>
            hello
        </Box>
    );
}
