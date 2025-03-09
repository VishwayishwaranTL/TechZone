import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import StarRating from "../../../starRating.jsx";
import "../css/productIdPage.css";

function ProductIdPage() {
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart")) || {});
    const [reviews, setReviews] = useState([]); 
    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(5);
    const [error, setError] = useState(null);

    const user = JSON.parse(localStorage.getItem("user")); 

    useEffect(() => {
        const fetchProductById = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/products/${id}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                
                const data = await response.json();
                if (data.success) {
                    setProduct(data.data);
                    setReviews(data.data.reviews || []);
                } else {
                    console.error("Product not found");
                }
            } catch (error) {
                console.error("Error fetching product:", error.message);
            }
        };

        if (id) fetchProductById();
    }, [id]);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const handleReviewSubmit = async () => {
        const token = localStorage.getItem("token");
    
        if (!token) {
            console.error("No token found in localStorage!");
            return;
        }
    
        try {
            const response = await fetch(`${BASE_URL}/api/products/${id}/review`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    rating: reviewRating,
                    comment: reviewText,
                }),
            });    
            const data = await response.json();
    
            if (response.status === 401) {
                console.error("Unauthorized: Invalid or expired token.");
            }
    
            if (data.success) {
                console.log("Review added successfully:", data);
            } else {
                console.error("Error:", data.message);
            }
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };
    
    
    

    if (!product) {
        return <div className="idPage">Loading....</div>;
    }

    const cartQuantity = Object.values(cart).reduce((sum, item) => sum + (item.quantity || 0), 0);

    return (
        <>
                <div className="idPage">
            <div className="cartSection" onClick={() => navigate("/cart")}>
                <button className="cartPage">🛒{cartQuantity > 0 && <span className="cartQuantity">{cartQuantity}</span>}</button>
            </div>
            <div className="contents">
                <div className="productImage">
                    <img src={product.image} alt={product.name} className="proimg" />
                </div>
                <div className="productDetails">
                    <h1>{product.name}</h1>
                    <div className="priceId">
                        <span className="productPriceId">₹{product.price.toFixed(2)}</span>
                        {product.discount && (
                            <>
                                <span className="discountedPriceId">
                                    ₹{(product.price - (product.price * product.discount) / 100).toFixed(2)}
                                </span>
                                <span className="discountTagId">({product.discount}% OFF)</span>
                            </>
                        )}
                    </div>
                    <div className="ratingId">
                        <StarRating rating={product.rating} />
                        <span style={{ color: "blue", fontWeight: "bold" }}>{product.rating}</span>
                    </div>
                    <div className="brandId">
                        <strong>Brand:</strong> {product.brand}
                    </div>
                    <div className="deviceId">
                        <strong>Device:</strong> {product.device}
                    </div>
                    <div className="categoryId">
                        <strong>Category:</strong> {product.category}
                    </div>
                    <div className="descriptionId">
                        <strong>Description:</strong> {product.description}
                    </div>

                    <div className="addToCart">
                        {!cart[id] ? (
                            <button className="add" onClick={() => setCart({...cart, [id]: {...product, quantity: 1}})}>
                                Add To Cart
                            </button>
                        ) : (
                            <div className="cartControls">
                                <button onClick={() => setCart({...cart, [id]: {...cart[id], quantity: cart[id].quantity + 1}})}>+</button>
                                <p>{cart[id].quantity}</p>
                                <button onClick={() => setCart({...cart, [id]: {...cart[id], quantity: cart[id].quantity - 1}})}>-</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>


        </div>
        <div className="reviews">
                <h2>Reviews</h2>
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review._id} className="review">
                            <p><strong>{review.name}</strong> - {review.rating}⭐</p>
                            <p>{review.comment}</p>
                            <hr />
                        </div>
                    ))
                ) : (
                    <p>No reviews yet. Be the first to review!</p>
                )}

                {error && <p className="error">{error}</p>}

                <div className="addReview">
                    <h3>Add Your Review</h3>
                    <select value={reviewRating} onChange={(e) => setReviewRating(Number(e.target.value))}>
                        {[...Array(5)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1} Star</option>
                        ))}
                    </select>
                    <textarea 
                        placeholder="Write your review..." 
                        value={reviewText} 
                        onChange={(e) => setReviewText(e.target.value)}
                    />
                    <button onClick={handleReviewSubmit}>Submit Review</button>
                </div>
            </div>
        </>
    );
}

export default ProductIdPage;
