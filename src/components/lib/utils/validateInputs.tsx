import { Auth } from "firebase/auth";
import React from "react";
import { useState } from "react";

let formValid = true;

type SetEmailErrorFunction = (errorMessage: string) => void;
type SetPasswordErrorFunction = (errorMessage: string) => void;
type SetUsernameErrorFunction = (errorMessage: string) => void;

const isValidEmail = (email: string) => {
  const emailPattern = /^[a-z]+[a-z0-9._-]*@gmail\.com$/;
  return emailPattern.test(email);
};

const isValidPassword = (password: string) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  return passwordRegex.test(password);
};

export const validateEmail = (
  email: string,
  setEmailError: SetEmailErrorFunction
) => {
  if (!email) {
    setEmailError("please enter your email");
    formValid = false;
  } else if (!isValidEmail(email)) {
    setEmailError("please enter a valid email");
    formValid = false;
  } else {
    setEmailError("");
  }
  return formValid;
};

export const validatePassword = (
  password: string,
  setPasswordError: SetPasswordErrorFunction
) => {
  if (!password) {
    setPasswordError("please enter your password");
    formValid = false;
  } else if (!isValidPassword(password)) {
    setPasswordError(
      "Password should be at least 8 characters and include at least one alphabetical character, one numeric digit, and one special character (@$!%*#?&)."
    );
    formValid = false;
  } else {
    setPasswordError("");
  }
  return formValid;
};

export const validateUsername = (
  username: string,
  setUsernameError: SetUsernameErrorFunction
) => {
  if (!username) {
    setUsernameError("Username is required");
    return (formValid = false); // Username validation failed, set formValid to false
  } else {
    setUsernameError("");
    return formValid; // Email validation passed, maintain the formValid state
  }
};
