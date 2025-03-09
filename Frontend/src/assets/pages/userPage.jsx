import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import "../css/userPage.css";

function UserPage() {
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatedUser, setUpdatedUser] = useState({});
    const [updateStatus, setUpdateStatus] = useState({}); 

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                console.log("No token found, redirecting to login.");
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(`${BASE_URL}/api/user/profile`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Unauthorized! Redirecting to login...");
                }

                const data = await response.json();
                if (data.success) {
                    setUser(data.data);
                    setUpdatedUser(data.data); 
                } else {
                    throw new Error("Failed to authenticate user");
                }
            } catch (error) {
                console.error(error);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleFieldUpdate = async (field) => {
        const newValue = updatedUser[field];

        if (!newValue || newValue.trim() === "") {
            alert(`Please enter a valid ${field} before updating.`);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found!");
                navigate("/login");
                return;
            }

            const response = await fetch(`${BASE_URL}/api/user/update/${user._id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ [field]: newValue }),
            });

            if (!response.ok) {
                throw new Error("Failed to update " + field);
            }

            const data = await response.json();
            if (data.success) {
                setUser((prev) => ({ ...prev, [field]: newValue }));
                setUpdateStatus((prev) => ({ ...prev, [field]: true }));

                setTimeout(() => setUpdateStatus((prev) => ({ ...prev, [field]: false })), 2000);
            } else {
                throw new Error(data.message || "Update failed");
            }
        } catch (error) {
            console.error(error);
            setError(`Error updating ${field}: ${error.message}`);
        }
    };

    if (loading) return <div>Loading user details...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
        <div className="user-container">
            <h2>User Profile</h2>
            {user && (
                <div className="user-details">
                    <p>
                        <strong>First Name:</strong> {user.firstName}
                    </p>
                    <p>
                        <strong>Last Name:</strong> {user.lastName}
                    </p>
                    <p>
                        <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                        <strong>Date of Birth:</strong> {user.dob ? format(new Date(user.dob), "MMMM dd, yyyy") : "N/A"}
                    </p>
                    
                    <p>
                        <strong>Address:</strong>
                        <input
                            type="text"
                            name="address"
                            value={updatedUser.address || ""}
                            onChange={handleInputChange}
                            placeholder="Enter Address"
                        />
                        <button onClick={() => handleFieldUpdate("address")}>
                            {updateStatus.address ? "✔" : "+"}
                        </button>
                    </p>

                    <p>
                        <strong>Phone No:</strong>
                        <input
                            type="text"
                            name="phone"
                            value={updatedUser.phone || ""}
                            onChange={handleInputChange}
                            placeholder="Enter Phone Number"
                        />
                        <button onClick={() => handleFieldUpdate("phone")}>
                            {updateStatus.phone ? "✔" : "+"}
                        </button>
                    </p>
                </div>
            )}
            <button className="myOrderbtn" onClick={()=> navigate("/myorders")}>My Orders</button>
        </div>
        </>
    );
}

export default UserPage;
