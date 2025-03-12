import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/myOrderPage.css";

const MyOrders = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || {});
    const cartQuantity = Object.values(cart).reduce((sum, item) => sum + (item?.quantity || 0), 0);

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
                setOrders(data.data || []);
            } catch (err) {
                console.error("Fetch Error:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

    return (
        <div className="orders-container">
            <h2>My Orders</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                orders.map((order) => (
                    <div key={order._id} className="order-card">
                        <h3>Order ID: {order.orderId}</h3>
                        <p><strong>Placed on:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                        <p><strong>Total:</strong> ₹{order.purchases[0].total}</p>
                    </div>
                ))
            )}

            {cartQuantity > 0 && (
                <div className="cartSection" onClick={() => navigate("/cart")}>
                    <button className="cartPage">🛒{cartQuantity > 0 && <span className="cartQuantity">{cartQuantity}</span>}</button>
                </div>
            )}

            <button onClick={() => navigate("/products")}>Start Purchasing</button>
        </div>
    );
};

export default MyOrders;
