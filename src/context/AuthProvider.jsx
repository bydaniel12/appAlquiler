import {
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebaseconfig";
import { db } from "../firebaseconfig";
import { setDoc, doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Registrar usuario y guardar rol en Firestore
  const registerUserWithRole = async (
    email,
    password,
    role = "user",
    name = "",
    phone = ""
  ) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userObj = userCredential.user;
    await setDoc(doc(db, "users", userObj.uid), {
      email: userObj.email,
      role,
      name,
      phone,
      createdAt: new Date(),
    });
    return userObj;
  };
  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    return await signOut(auth);
  };

  // Obtener el rol del usuario desde Firestore
  const getUser = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        return data;
      }
      return "";
    } catch {
      return "";
    }
  };

  useEffect(() => {
    const unsuscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsuscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        registerUserWithRole,
        getUser,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
