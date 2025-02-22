import React, { useState } from "react";
import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import Footer from "./Components/Footer";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import "./App.css";


const App = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="app-container">
       <Navbar
        onSignInClick={() => setShowSignIn(true)} 
        onSignUpClick={() => setShowSignUp(true)}
        />
    


<Hero />
<Footer />


{showSignIn && <SignIn onClose={() => setShowSignIn(false)} />}
{showSignUp && <SignUp onClose={() => setShowSignUp(false)} />}
    </div>
  );
};

export default App;
