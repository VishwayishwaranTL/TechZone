import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/checkoutPage.css";

const CheckoutPage = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [userDetails, setUserDetails] = useState({ address: "", phone: "", email: "" });
    const [updatedUser, setUpdatedUser] = useState({});

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }
    
        const storedCart = JSON.parse(localStorage.getItem("cart")) || {};
        const cartItems = Object.values(storedCart);
    
        const calculatedTotal = cartItems.reduce((acc, product) => {
            const discountedPrice = product.discount
                ? product.price - (product.price * product.discount) / 100
                : product.price;
            return acc + discountedPrice * product.quantity;
        }, 0);
    
        setCart(cartItems);
        setTotal(calculatedTotal);
    
        const fetchUserProfile = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/user/profile`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
    
                if (!response.ok) {
                    throw new Error("Failed to fetch user details");
                }
    
                const data = await response.json();
    
                if (data.success && data.data) {
                    setUserDetails({
                        _id: data.data._id || "", 
                        address: data.data.address || "",
                        phone: data.data.phone || "",
                        email: data.data.email || "",
                    });
                    
    
                    setUpdatedUser({
                        address: data.data.address || "",
                        phone: data.data.phone || "",
                    });
    
                    if (!data.data.address || !data.data.phone) {
                        alert("Please update your address and phone number before proceeding.");
                    }
                } else {
                    throw new Error("User data retrieval failed.");
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
                alert("Failed to retrieve user details. Please try again.");
            }
        };
    
        fetchUserProfile();
    }, [navigate]);

    const handlePayment = async () => {
        if (!userDetails.email || !userDetails.address || !userDetails.phone) {
            alert("Please ensure your email, address, and phone number are filled before proceeding.");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            const gstRate = 0.18;
            const totalWithGST = total * (1 + gstRate);
    
            console.log("Sending order request:", JSON.stringify({
                purchases: [
                    {
                        products: cart.map(({ name, quantity }) => ({
                            productname: name,
                            quantity,
                        })),
                        total: totalWithGST.toFixed(2),
                        address: userDetails.address,
                        phone: userDetails.phone,
                        email: userDetails.email,
                    },
                ],
            }, null, 2));
    
            const response = await fetch(`${BASE_URL}/api/orders`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    purchases: [
                        {
                            products: cart.map(({ name, quantity }) => ({
                                productname: name,
                                quantity,
                            })),
                            total: totalWithGST.toFixed(2),
                            address: userDetails.address,
                            phone: userDetails.phone,
                            email: userDetails.email,
                        },
                    ],
                }),
            });
    
            const data = await response.json();
            console.log("Response from server:", data);
    
            if (response.ok) {
                localStorage.removeItem("cart");
                navigate("/payment-success", { state: { orderDetails: data.order, totalWithGST } });
            } else {
                console.error("Payment failed:", data.message);
                alert(data.message || "Failed to place order.");
            }
        } catch (error) {
            console.error("Error processing payment:", error);
            alert("An error occurred. Please try again.");
        }
    };
    
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
    
            if (!userDetails._id) {
                console.error("User ID is missing!");
                return;
            }
    
            const response = await fetch(`${BASE_URL}/api/user/update/${userDetails._id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ [field]: newValue }),
            });
    
            if (!response.ok) {
                throw new Error(`Failed to update ${field}`);
            }
    
            const data = await response.json();
            if (data.success) {
                setUserDetails((prev) => ({ ...prev, [field]: newValue }));
                setUpdatedUser((prev) => ({ ...prev, [field]: newValue }));
    
                alert(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
            } else {
                throw new Error(data.message || "Update failed");
            }
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
            alert(`Error updating ${field}: ${error.message}`);
        }
    };
    

    return (
        <div className="checkoutContainer">
            <h1>Order Summary</h1>
            {cart.length > 0 ? (
                <table className="orderTable">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Original Price (₹)</th>
                            <th>Discounted Price (₹)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((product, index) => {
                            const discountedPrice = product.discount
                                ? product.price - (product.price * product.discount) / 100
                                : product.price;

                            return (
                                <tr key={index}>
                                    <td>{product.name}</td>
                                    <td>{product.quantity}</td>
                                    <td>
                                        {product.discount ? (
                                            <s>₹{(product.price * product.quantity).toFixed(2)}</s>
                                        ) : (
                                            `₹${(product.price * product.quantity).toFixed(2)}`
                                        )}
                                    </td>
                                    <td>₹{(discountedPrice * product.quantity).toFixed(2)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <p>Your cart is empty.</p>
            )}

            <h2>Subtotal: ₹{total.toFixed(2)}</h2>
            <h2>GST (18%): ₹{(total * 0.18).toFixed(2)}</h2>
            <h2>Total (incl. GST): ₹{(total * 1.18).toFixed(2)}</h2>

            <div className="userDetails">
                <h3>Shipping Details</h3>
                <p><strong>Email:</strong> {userDetails.email}</p>
                <p><strong>Address:</strong>
                    <input
                        type="text"
                        name="address"
                        value={updatedUser.address ?? userDetails.address ?? ""}
                        onChange={handleInputChange}
                        placeholder="Enter Address"
                    />
                    <button onClick={() => handleFieldUpdate("address")}>Update</button>
                </p>

                <p><strong>Phone No:</strong>
                    <input
                        type="text"
                        name="phone"
                        value={updatedUser.phone ?? userDetails.phone ?? ""}
                        onChange={handleInputChange}
                        placeholder="Enter Phone Number"
                    />
                    <button onClick={() => handleFieldUpdate("phone")}>Update</button>
                </p>

            </div>

            {cart.length > 0 && (
                <button className="payBtn" onClick={handlePayment}>
                    Proceed to Payment
                </button>
            )}
        </div>
    );
};

export default CheckoutPage;