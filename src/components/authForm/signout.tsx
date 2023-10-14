import React from "react";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { app } from "../lib/Firebase/firebase";
import Link from "next/link";
import "./../../../public/style/chatList/chatList.css";

const Signout = () => {
  const auth = getAuth(app);
  const [user, loading] = useAuthState(auth);
  return (
    <div className="navbar">
      <h2>ChatApp</h2>
      {user && (
        <Link
          className="signout-button"
          href="/auth"
          onClick={() => auth.signOut()}
        >
          Sign Out
        </Link>
      )}
    </div>
  );
};

export default Signout;
