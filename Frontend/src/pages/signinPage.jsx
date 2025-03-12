import React, { useState } from "react";
import '../assets/css/signinPage.css';

function SigninPage() {
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        email: '',
        password: '',
        confirmPassword: ''  
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async () => {
        const { firstName, lastName, dob, email, password, confirmPassword } = formData;

        if (!firstName || !lastName || !dob || !email || !password || !confirmPassword) {
            alert('Please fill in all required fields.');
            return;
        }

        if (password !== confirmPassword) {  
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/user/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ firstName, lastName, dob, email, password }) 
            });

            const data = await response.json();
            if (data.success) {
                alert('Signup Successful. Please Login.');
                window.location.href = "/login"; 
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error during signup:", error);
            alert('Error occurred. Please try again');
        }
    };

    return (
        <>
        <div className="signinContainer">
            <h1>Sign Up</h1>
            <div className='details'>
                <label htmlFor="firstName">First Name<span>*</span></label>
                <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} required />

                <label htmlFor="lastName">Last Name<span>*</span></label>
                <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} required />

                <label htmlFor="dob">DOB<span>*</span></label>
                <input type="date" id="dob" value={formData.dob} onChange={handleChange} required />

                <label htmlFor="email">Email Id<span>*</span></label>
                <input type="email" id="email" value={formData.email} onChange={handleChange} required />

                <label htmlFor="password">Password<span>*</span></label>
                <input type="password" id="password" value={formData.password} onChange={handleChange} required />

                <label htmlFor="confirmPassword">Confirm Password<span>*</span></label>
                <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />

                <button className="signupButton" onClick={handleSubmit}>Sign Up</button> 
            </div>
        </div>
        </>
    );
}

export default SigninPage;
