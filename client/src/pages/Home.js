import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/altru.png";
import background from "../assets/volunteer1.jpg";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <div
      className="background"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="banner">
        <div className="logo-wrapper">
          {/* <img className="home-logo" src={logo} alt="logo" /> */}
          VolunteerConnect
          <div className="buttons">
            <div className="login-btn" onClick={handleLogin}>
              Login
            </div>
            <div className="signup-btn" onClick={handleSignup}>
              Signup
            </div>
          </div>
        </div>
      </div>
      <div className="home-text">
        <p className="welcome-text">Volunteer. Inspire. Transform </p>
        <p className="sub-text">Make a difference in your community.</p>
      </div>
    </div>
  );
};

export default Home;
