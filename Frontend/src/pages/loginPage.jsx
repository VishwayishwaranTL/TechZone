import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../assets/css/loginPage.css';

function LoginPage() {
    const BASE_URL = import.meta.env.VITE_BASE_URL;
    console.log(BASE_URL)

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
            const response = await fetch(`${BASE_URL}/api/user/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
    
            const data = await response.json();
    
            if (data.success && data.token) {  
                localStorage.setItem("token", data.token);  
                console.log("Token",data.token);
                alert("Login Successful");
                navigate("/");  
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("An error occurred. Please try again.");
        }
    };
    

    return (
        <div className="signupContainer">
            <h1>Login Details</h1>
            <div className="details">
                <label htmlFor="email">Email Id<span>*</span></label>
                <input
                    type="text"
                    placeholder="Enter Your Mail ID"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="password">Password<span>*</span></label>
                <input
                    type="password"
                    placeholder="Enter Your Password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <p>Don't have an Account? <Link to="/signin">SignUp</Link></p>

                <button className="signupButton" onClick={handleSubmit}>Login</button>
            </div>
        </div>
    );
}

export default LoginPage;
