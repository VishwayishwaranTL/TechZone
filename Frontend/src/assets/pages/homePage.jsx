import { useNavigate } from "react-router-dom";
import '../css/homePage.css';
import { useEffect } from "react";

function HomePage() {
    const navigate = useNavigate();

    useEffect(() => {
        if (!sessionStorage.getItem("visited")) {
          localStorage.removeItem("token"); 
          console.log("Token cleared from localStorage");
    
          sessionStorage.setItem("visited", "true");
        }
      }, []);

    const handleExploreClick = () => {
        const token = localStorage.getItem("token");  
        if (token) {
            navigate("/products");  
        } else {
            navigate("/login");  
            alert("Please log in to continue.");
        }
    };

    return (
        <div className="home-container">
            <h1 className="home-title">Welcome to TechZone</h1>
            <p className="home-description">Your one-stop shop for the latest electronics at unbeatable prices!</p>
            <div className="home-categories">
            <h2>Popular Categories</h2>
            <ul>
                <li>📱 Smartphones</li>
                <li>💻 Laptops</li>
                <li>🎧 Headphones</li>
                <li>⌚ Smartwatches</li>
                <li>📷 Cameras</li>
            </ul>

            <button 
                onClick={handleExploreClick} className="home-explore-button">
                Explore Products
            </button>
            </div>
        </div>
    );
}

export default HomePage;
