import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../assets/css/navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const [login, setLogin] = useState(!!localStorage.getItem("token"));
    const [admlogin, setAdmlogin] = useState(!!localStorage.getItem("adminToken"));
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setLogin(!!token);
        const admToken = localStorage.getItem("adminToken");
        setAdmlogin(!!admToken);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("adminToken");
        setLogin(false);
        setAdmlogin(false);
        navigate("/");
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                {location.pathname !== "/" && (
                    <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
                )}
                <img src="/techzone.jpg" alt="TechZone Logo" className="logo" onClick={() => navigate("/")} />
                <h1 className="storeHeading" onClick={() => navigate("/")}>TechZone</h1>
            </div>

            <div className="navbar-right">
                {admlogin ? (
                    <>
                        <button className="logout" onClick={handleLogout}>Log out</button>
                        <button className="user" onClick={() => navigate("/admin/user")}>Admin</button>
                    </>
                ) : login ? (
                    <>
                        <button className="logout" onClick={handleLogout}>Log out</button>
                        <button className="user" onClick={() => navigate("/user/")}>User</button>
                    </>
                ) : (
                    <>
                        <button className="login" onClick={() => navigate("/login")}>Login</button>
                        <button className="signin" onClick={() => navigate("/signin")}>Sign in</button>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
