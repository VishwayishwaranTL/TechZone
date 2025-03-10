import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/cartPage.css";

function CartPage() {
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const [cart, setCart] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("cart")) || {};
        } catch (error) {
            console.error("Error getting cart from localStorage:", error);
            return {};
        }
    });
    
    const navigate = useNavigate();
    const [total, setTotal] = useState(0);
    const [cartItems, setCartItems] = useState(() => {
        return JSON.parse(localStorage.getItem("cartItems")) || [];
    });
    
    useEffect(() => {
        const cartItems = Object.values(cart);
        const calculatedTotal = cartItems.reduce((acc, product) => {
            const discountedPrice = product.discount
                ? product.price - (product.price * product.discount) / 100
                : product.price;
            return acc + discountedPrice * product.quantity;
        }, 0);
        setTotal(calculatedTotal);
    }, [cart]);

    const handleIncreaseQuantity = (productId, stock) => {
        setCart((prevCart) => {
            const currentQuantity = prevCart[productId]?.quantity || 0;
            if (currentQuantity >= stock) {
                alert("You've reached the maximum available stock for this product.");
                return prevCart;
            }
            const updatedCart = {
                ...prevCart,
                [productId]: {
                    ...prevCart[productId],
                    quantity: currentQuantity + 1,
                },
            };
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    const handleDecreaseQuantity = (productId) => {
        setCart((prevCart) => {
            const newQuantity = prevCart[productId]?.quantity - 1;
            if (newQuantity === 0) {
                const updatedCart = { ...prevCart };
                delete updatedCart[productId];
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                return updatedCart;
            }
            const updatedCart = {
                ...prevCart,
                [productId]: {
                    ...prevCart[productId],
                    quantity: newQuantity,
                },
            };
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => {
            const updatedCart = { ...prevCart };
            delete updatedCart[productId];
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return updatedCart;
        });
    };

    return (
        <div className="cartContainer">
            <h1 className="cartHeading">Your Cart</h1>
            {Object.keys(cart).length > 0 ? (
                <div className="cartItems">
                    {Object.values(cart).map((product) => {
                        const discountedPrice = product.discount
                            ? product.price - (product.price * product.discount) / 100
                            : product.price;

                        return (
                            <div className="cartProduct" key={product._id}>
                                <img src={product.image} alt={product.name} className="cartImage" onClick={()=>{
                                    navigate(`/product/${product._id}`)}}/>
                                <div className="cartDetails">
                                    <h3>{product.name}</h3>
                                    <p><strong>Price:</strong> ₹{discountedPrice}</p>
                                    <div className="cartQuantityControl">
                                        <button onClick={() => handleDecreaseQuantity(product._id)}>-</button>
                                        <span>{product.quantity}</span>
                                        <button onClick={() => handleIncreaseQuantity(product._id, product.stock)}
                                            disabled={product.quantity >= product.stock}
                                            style={{ cursor: product.quantity >= product.stock ? "not-allowed" : "pointer" }}>+</button>
                                    </div>
                                    <button className="removeBtn" onClick={() => removeFromCart(product._id)}>Remove</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="ifNot">
                    <p className="emptyCart">Your cart is empty.</p>
                </div>
            )}
            <h2>Total: ₹{total.toFixed(2)}</h2>
            <button className="explorebtn" onClick={() => navigate("/products")}>Want to Explore More?</button>
            {Object.keys(cart).length > 0 && (
                <button className="checkoutBtn" onClick={() => navigate("/checkout")}>Proceed to Checkout</button>
            )}
        </div>
    );
}

export default CartPage;
