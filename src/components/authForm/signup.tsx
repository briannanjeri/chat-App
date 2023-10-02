"use client";
import React, { useState } from "react";
import { createUser } from "../lib/utils/createUser";

import "./../../../public/style/auth.css";

interface SignupProps {
  onFormSwitch: (formName: string) => void;
}

const Signup = ({ onFormSwitch }: SignupProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  console.log("usernameerror:", usernameError);

  return (
    <div className="auth-container">
      <header className="header">
        <nav className="secondary-nav">
          <ul>
            <li className="header-title">{/* <a href="#">Chat App</a> */}</li>
            <li className="header-login">
              <button onClick={() => onFormSwitch("login")}>Login</button>
            </li>
          </ul>
        </nav>
      </header>
      <div className="input-container">
        <h2>Sign UP</h2>
        <input
          type="text"
          value={username}
          name="username"
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          value={email}
          name="email"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          value={password}
          name="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={() =>
            createUser({
              email,
              password,
              username,
              setEmailError,
              setPasswordError,
              setUsernameError,
            })
          }
        >
          Sign Up
        </button>
        <button onClick={() => onFormSwitch("login")} className="switch-button">
          Already have an account? login here
        </button>
      </div>
    </div>
  );
};

export default Signup;
