import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SignIn.css";

const SignIn = ({ onClose}) => {

  return (
    <div className="signin-container d-flex justify-content-center align-items-center">
      <div className="signin-box row">
      
        {/* Left Section: Image */}
        <div className="col-md-6 signin-image">
          <img src="signin 1.jpg" alt="Sign In" className="img-fluid" />
        </div>

        {/* Right Section: Sign-In Form */}
        <div className="col-md-6 signin-form p-4">
          <button className="close-btn position-absolute top-0 end-0 m-3" onClick={onClose}>&times;</button>
          <h2 className="text-center mb-4">Sign In</h2>
          <form>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" placeholder="Enter your email" required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" placeholder="Enter your password" required />
            </div>
            <button type="submit" className="btn btn-primary w-100">Sign In</button>
          </form>
         
        </div>
      </div>
    </div>
  );
};

export default SignIn;
