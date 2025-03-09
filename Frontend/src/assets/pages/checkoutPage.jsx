import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/checkoutPage.css";

const CheckoutPage = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const navigate = useNavigate();
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [userDetails, setUserDetails] = useState({ address: "", phone: "", email: "" });

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
                        address: data.data.address || "",
                        phone: data.data.phone || "",
                        email: data.data.email || "",
                    });

                    if (!data.data.address || !data.data.phone) {
                        alert("Please update your address and phone number before proceeding.");
                        navigate("/user");
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
                <p><strong>Address:</strong> {userDetails.address}</p>
                <p><strong>Phone:</strong> {userDetails.phone}</p>
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