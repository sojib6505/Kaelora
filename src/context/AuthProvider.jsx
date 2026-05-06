import { createContext, useEffect, useState } from "react";
import auth from "../firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
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
  const googleLogin = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };
  const logout = () => {
    return signOut(auth);
  };



  const authInfo = {
    user,
    signUp,
    login,
    googleLogin,
    logout,
  };
  return <AuthContext value={authInfo}>{children}</AuthContext>;
};
