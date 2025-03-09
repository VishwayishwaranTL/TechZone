import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/myOrderPage.css"

const MyOrders = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    throw new Error("Unauthorized. Please log in.");
                }

                const response = await fetch(`${BASE_URL}/api/orders/user`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${await response.text()}`);
                }

                const data = await response.json();
                console.log("Orders Fetched:", data);

                if (!data.data || data.data.length === 0) {
                    setOrders([]);
                } else {
                    setOrders(data.data);
                }
            } catch (err) {
                console.error("Fetch Error:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <h2 style={{ textAlign: "center", marginTop: "20px" }}>Loading...</h2>;
    }

    if (error && orders.length === 0) {
        return (
            <div style={{ textAlign: "center", padding: "20px" }}>
                <h2 style={{ color: "red" }}>No orders found</h2>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>My Orders</h2>
            {orders.length === 0 ? (
                <div style={{ textAlign: "center" }}>
                    <p>You haven't made any orders yet.</p>
                </div>
            ) : (
                <div>
                    {orders.map((order) => (
                        <div 
                            key={order._id} 
                            style={{
                                border: "1px solid #ddd", 
                                padding: "15px", 
                                marginBottom: "15px", 
                                borderRadius: "8px",
                                boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)"
                            }}
                        >
                            <h3>Order ID: {order.orderId}</h3>
                            <p><strong>Placed on:</strong> {new Date(order.createdAt).toLocaleString()}</p>

                            <h4>Products:</h4>
                            <ul>
                                {order.purchases[0].products.map((product, index) => (
                                    <li key={index}>
                                        {product.productname} - Quantity: {product.quantity}
                                    </li>
                                ))}
                            </ul>

                            <p><strong>Total:</strong> ₹{order.purchases[0].total}</p>
                            <p><strong>Shipping Address:</strong> {order.purchases[0].address}</p>
                            <p><strong>Contact:</strong> {order.purchases[0].phone} | {order.purchases[0].email}</p>
                        </div>
                    ))}
                </div>
            )}
                            <button 
                    style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        cursor: "pointer",
                        marginTop: "10px"
                    }}
                    onClick={() => navigate("/products")}
                >
                    Start Purchasing
                </button>
        </div>
    );
};

export default MyOrders;
