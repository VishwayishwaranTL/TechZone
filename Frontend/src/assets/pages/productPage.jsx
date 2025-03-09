import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "../../../starRating.jsx";
import "../css/productPage.css";

function ProductPage() {
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [cart, setCart] = useState(() => {
        return JSON.parse(localStorage.getItem("cart")) || {};
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/products`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.success) {
                    setProducts(data.data);
                } else {
                    console.error("Failed to fetch products");
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.brand.toLowerCase().includes(search.toLowerCase()) ||
            product.device.toLowerCase().includes(search.toLowerCase()) ||
            product.category.toLowerCase().includes(search.toLowerCase())
    );

    const handleAddToCart = (e, productId, product) => {
        e.stopPropagation();
        setCart((prevCart) => ({
            ...prevCart,
            [productId]: { ...product, quantity: prevCart[productId]?.quantity ? prevCart[productId].quantity + 1 : 1 },
        }));
    };

    const handleIncreaseQuantity = (e, productId, product) => {
        e.stopPropagation();
        setCart((prevCart) => {
            const currentQuantity = prevCart[productId]?.quantity || 0;

            if (currentQuantity >= product.stock) {
                alert("You've reached the maximum available stock for this product.");
                return prevCart;
            }

            return {
                ...prevCart,
                [productId]: { ...prevCart[productId], quantity: currentQuantity + 1 },
            };
        });
    };

    const handleDecreaseQuantity = (e, productId) => {
        e.stopPropagation();
        setCart((prevCart) => {
            const newQuantity = prevCart[productId]?.quantity - 1;
            if (newQuantity === 0) {
                const updatedCart = { ...prevCart };
                delete updatedCart[productId];
                return updatedCart;
            }
            return {
                ...prevCart,
                [productId]: { ...prevCart[productId], quantity: newQuantity },
            };
        });
    };

    const cartQuantity = Object.values(cart).reduce((sum, item) => sum + (item?.quantity || 0), 0); 



    return (
        <div className="productContainer">
            <h1>Explore Our Products</h1>

            <div className="searchCart">
                <input
                    type="text"
                    placeholder="Search by Name, Brand, Device or Category..."
                    className="searchBox"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="cartSection" onClick={() => navigate("/cart")}>
                    <button className="cartPage">🛒{cartQuantity > 0 && <span className="cartQuantity">{cartQuantity}</span>}</button>
                </div>
            </div>

            <div className="productList">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => {
                        const discountedPrice = product.discount
                            ? product.price - (product.price * product.discount) / 100
                            : product.price;

                        return (
                            <div key={product._id} className="productCard" onClick={() => navigate(`/product/${product._id}`)}>
                                <img src={product.image} alt={product.name} className="productImage" />
                                <div className="productInfo">
                                    <h2>{product.name}</h2>
                                    <p className="brand"><strong>Brand:</strong> {product.brand}</p>
                                    <p className="device"><strong>Device:</strong> {product.device}</p>
                                    <p className="category"><strong>Category:</strong> {product.category}</p>
                                    <div className="rating">
                                        <StarRating rating={product.rating} />
                                        <span>{product.rating}</span>
                                    </div>

                                    <p className="price">
                                        <span className="productPrice">₹{product.price.toFixed(2)}</span>
                                        {product.discount && (
                                            <>
                                                <span className="discountedPrice">₹{discountedPrice.toFixed(2)}</span>
                                                <span className="discountTag">({product.discount}% OFF)</span>
                                            </>
                                        )}
                                    </p>

                                    <p className="description">{product.description?.substring(0, 80)}...</p>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/product/${product._id}`);
                                        }}
                                    >
                                        View Details
                                    </button>
                                </div>

                                <div className="addToCart">
                                    {!cart[product._id] ? (
                                        <button className="add" onClick={(e) => handleAddToCart(e, product._id, product)}>
                                            Add To Cart
                                        </button>
                                    ) : (
                                        <div className="cartControls">
                                            <button
                                                onClick={(e) => handleIncreaseQuantity(e, product._id, product)}
                                                disabled={cart[product._id]?.quantity >= product.stock}
                                                style={{
                                                    cursor: cart[product._id]?.quantity >= product.stock ? "not-allowed" : "pointer",
                                                }}
                                            >
                                                +
                                            </button>
                                            <p>{cart[product._id]?.quantity || 0}</p>
                                            <button onClick={(e) => handleDecreaseQuantity(e, product._id)}>-</button>
                                        </div>
                                    )}
                                    {cart[product._id]?.quantity === product.stock && <p className="alert">*Max Stock Limit Reached</p>}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="noProducts">No products found.</p>
                )}
            </div>
        </div>
    );
}

export default ProductPage;