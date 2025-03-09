import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../css/adminPage.css';

function AdminPage() {
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async () => {
        const { email, password } = formData;
        if (!email || !password) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/admin/login`, { 
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage || "Login failed. Please try again.");
            }

            const data = await response.json();

            if (data.success && data.token) {
                localStorage.setItem("adminToken", data.token);
                const token = localStorage.getItem("adminToken");
                console.log(token);
                alert("Admin Login Successful");
                navigate("/admin/dashboard");  
                
                console.log("Token:", data.token);
            } else {
                alert(data.message || "Login failed.");
            }
        } catch (error) {
            console.error("Login Error:", error.message);
            alert(error.message);
        }
    };

    return (
        <div className="adminContainer">
            <h1>Admin Login</h1>
            <div className="adminDetails">
                <label htmlFor="email">Email Id<span>*</span></label>
                <input
                    type="text"
                    placeholder="Enter Admin Email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="password">Password<span>*</span></label>
                <input
                    type="password"
                    placeholder="Enter Admin Password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button className="adminButton" onClick={handleSubmit}>Login</button>
            </div>
        </div>
    );
}

export default AdminPage;
