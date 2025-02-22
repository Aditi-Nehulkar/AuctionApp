import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SignUp.css";

const SignUp = ({ onClose, onSwitchToSignIn }) => {
  return (
    <div className="signup-container d-flex justify-content-center align-items-center">
      <div className="signup-box row">
        {/* Close Button */}
        

        {/* Left Section: Image */}
        <div className="col-md-6 signup-image">
          <img src="sign up.jpg" alt="Sign Up" className="img-fluid" />
        </div>

        {/* Right Section: Sign-Up Form */}
        <div className="col-md-6 signup-form p-4">
        <button className="close-btn position-absolute top-0 end-0 m-3" onClick={onClose}>&times;</button>
          <h2 className="text-center mb-4">Sign Up</h2>
          <form>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" placeholder="Enter your name" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" placeholder="Enter your email" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" placeholder="Create a password" required />
            </div>
            <button type="submit" className="btn btn-primary w-100">Sign Up</button>
          </form>
          
        </div>
      </div>
    </div>
  );
};

export default SignUp;
