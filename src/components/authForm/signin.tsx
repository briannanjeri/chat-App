"use client";
import React from "react";
import { Auth, db, app } from "../lib/Firebase/firebase";
import { useState, useEffect } from "react";
import { getFirestore } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth/cordova";
import "./../../../public/style/auth.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

interface SigninProps {
  onFormSwitch: (formName: string) => void;
}

const Signin = ({ onFormSwitch }: SigninProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const login = async () => {
    //check if user exists in the users collection based by the email address
    try {
      const userQuery = query(
        collection(db, "users"),
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(userQuery);
      if (querySnapshot.empty) {
        // User does not exist, handle this case accordingly
        console.log("User does not exist.");
      } else {
        // User exists, attempt to sign in
        try {
          const usercredentials = await signInWithEmailAndPassword(
            Auth,
            email,
            password
          );
          const user = usercredentials.user;
          // Sign in successful, you can redirect or perform any desired action here
          if (user) {
            console.log("Sign in successful!");
            router.push("/");
          }
        } catch (signInError) {
          // Handle sign-in error (e.g., incorrect password)
          if (signInError instanceof Error) {
            // User does not exist, handle this case accordingly
            console.error("Sign-in error:", signInError.message);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="auth-container">
      <header className="header">
        <nav className="secondary-nav">
          <ul>
            <li className="header-title">{/* <a href="#">Chat App</a> */}</li>
            <li className="header-login">
              <button onClick={() => onFormSwitch("register")}>register</button>
            </li>
          </ul>
        </nav>
      </header>
      <div className="input-container">
        <h2>Log In</h2>

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
        <button onClick={login}>Sign In</button>
        <button
          onClick={() => onFormSwitch("register")}
          className="switch-button"
        >
          Not registered? create an Account
        </button>
      </div>
    </div>
  );
};

export default Signin;
