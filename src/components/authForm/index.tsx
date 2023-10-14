"use client";
import React from "react";
import Signup from "./signup";
import Signin from "./signin";
import { useState } from "react";
import { createUser } from "../lib/utils/createUser";

export const Index = () => {
  const [currentform, setCurrentForm] = useState("login");

  const toggleForm = (formName: string) => {
    setCurrentForm(formName);
  };

  return (
    <div>
      {currentform === "login" ? (
        <Signin onFormSwitch={toggleForm} />
      ) : (
        <Signup onFormSwitch={toggleForm} />
      )}
    </div>
  );
};
