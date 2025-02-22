import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";



const Navbar = ({ onSignInClick, onSignUpClick }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark w-100">
      <div className="container">
      <a className="navbar-brand d-flex align-items-center" href="#">
          <img src="/logo.jpeg" alt="Logo" width="50" height="50" className="me-2" />
          Artbid
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item"><a className="nav-link" href="#">Dashboard</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Post Auction</a></li>
            <li className="nav-item">
              <button className="btn btn-primary" onClick={onSignUpClick}>
                Sign Up
              </button>
            </li>
            <li className="nav-item">
              <button className="btn btn-outline-light" onClick={onSignInClick}>
                Sign In
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
