import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Auth, db } from "../Firebase/firebase";
import { validateEmail, validateUsername } from "./validateInputs";
import { validatePassword } from "./validateInputs";
import { updateProfile } from "firebase/auth";

import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  getFirestore,
} from "firebase/firestore";

interface Props {
  username: string;
  email: string;
  password: string;
  setEmailError: (errorMessage: string) => void;
  setPasswordError: (errorMessage: string) => void;
  setUsernameError: (errorMessage: string) => void;
}

export const createUser = async ({
  username,
  email,
  password,
  setUsernameError,
  setEmailError,
  setPasswordError,
}: Props) => {
  try {
    const isUsernameValid = validateUsername(username, setUsernameError);
    const isEmailValid = validateEmail(email, setEmailError);
    const isPasswordValid = validatePassword(password, setPasswordError);

    // if (!isUsernameValid || !isEmailValid || !isPasswordValid) {
    //   // Validation failed, do not proceed with user creation
    //   return;
    // }
    console.log("isusernameValid", isUsernameValid);
    console.log("isEmailValid", isEmailValid);
    console.log("isPasswordValid", isPasswordValid);

    const userCredentials = await createUserWithEmailAndPassword(
      Auth,
      email,
      password
    );

    if (userCredentials && userCredentials.user) {
      const user = userCredentials.user;
      await updateProfile(user, { displayName: username });

      // if (!user.emailVerified) {
      //   await sendEmailVerification(user);
      //   alert("Verification email sent. Please check your inbox");
      //   console.log("signup-user", user);
      // } else {
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          // The user already has an account
          console.log("User already exists");
        } else {
          // The user didn't have an account, so we must add the document
          console.log("User doesn't exist. Creating the document...");
          const userInfo = {
            uid: user.uid,
            email: user.email,
            displayName: username,
            // Add more user data as needed
          };

          await setDoc(userDocRef, userInfo);

          console.log("User added to Firestore with ID: ", userDocRef.id);
          alert("Account created and email already verified.");
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        }
      }
    }
    // }
    else {
      console.log("No user object found in userCredentials");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};
