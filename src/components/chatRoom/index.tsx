"use client";
import React from "react";
import ChatRoomCreation from "./chatRoomCreation";
import ChatRoomList from "./chatRoomList";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { app } from "../lib/Firebase/firebase";

const Index = () => {
  const [user, setUser] = useState<User | null>(null);

  const auth = getAuth(app);
  const [signedInUser, loading] = useAuthState(auth);

  useEffect(() => {
    if (signedInUser) {
      // User is signed in, you can store the user data in local storage here
      setUser(signedInUser);

      // Set the user state only once when the user is loaded or signed in
    }
  }, [user]);

  console.log("signedinuser", user);

  return (
    <div>
      {/* <ChatRoomCreation /> */}
      <ChatRoomList user={user} setUser={setUser} />
    </div>
  );
};

export default Index;
