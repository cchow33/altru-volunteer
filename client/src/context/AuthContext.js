import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { api } from "../utils/axios";
import { NotificationContext } from "./NotificationContext";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const { setNotification } = useContext(NotificationContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mongoUser, setMongoUser] = useState(null);

  const signUp = async (email, password) => {
    try {
      const data = await createUserWithEmailAndPassword(auth, email, password);
      setUser(data.user);
      return data;
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setNotification("Email already in use");
      } else if (error.code === "auth/invalid-email") {
        setNotification("Invalid email");
      } else if (error.code === "auth/weak-password") {
        setNotification("Weak password");
      }
    }
  };

  const signIn = async (email, password) => {
    try {
      const data = await signInWithEmailAndPassword(auth, email, password);
      console.log("Signing data", data);
      await verifyUser(data.user);
      console.log("Verify user", data.user);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setNotification("User not found, please sign up");
      } else if (error.code === "auth/wrong-password") {
        setNotification("Wrong password");
      } else if (error.code === "auth/invalid-email") {
        setNotification("Invalid email");
      }
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  const verifyUser = async (user) => {
    // console.log("Verifying user...", user);
    const token = await user.getIdToken();
    // console.log("Verifying token", token);
    const data = await api.get("/auth/verifyUser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (data.status === 401) {
      setNotification("User not found, please sign up");
      setUser(null);
    } else {
      setUser(user);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/volunteer");
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        handleSignOut,
        mongoUser,
        setMongoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
