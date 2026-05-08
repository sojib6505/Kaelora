import { createContext, useEffect, useState } from "react";
import auth from "../firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import AuthContext from "./AuthContext";

export default function  AuthProvider  ({ children })  {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
    //observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };
  const logout = () => {
    return signOut(auth);
  };
  
   const updateUserProfile = (name, photoURL = "") => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      ...(photoURL && { photoURL }),
    });
  };


  const authInfo = {
    user,
    signUp,
    login,
    googleSignIn,
    logout,
    updateUserProfile
  };
  return <AuthContext value={authInfo}>{children}</AuthContext>;
};
