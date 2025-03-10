import React, { useState, useEffect } from "react";
import axios from "axios";
import '../assets/css/adminUserPage.css';

const AdminUserPage = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const [adminDetails, setAdminDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const token = localStorage.getItem("adminToken");

    useEffect(() => {
        if (!token) {
            window.location.href = "/login";
            return;
        }

        const fetchAdminDetails = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/admin/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setAdminDetails(response.data);
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch admin details");
                setLoading(false);
            }
        };

        fetchAdminDetails();
    }, [token]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="adminContainer">
            <h1>Admin Details</h1>
            <div className="adminDetails">
                <p><strong>Name:</strong> {adminDetails.name}</p>
                <p><strong>Email:</strong> {adminDetails.email}</p>
                <p><strong>Role:</strong> {adminDetails.role}</p>
                <p><strong>Created At:</strong> {new Date(adminDetails.createdAt).toLocaleString()}</p>
            </div>
        </div>
    );
};

export default AdminUserPage;
