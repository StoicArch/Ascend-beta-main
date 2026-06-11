import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // load user from storage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  const login = (email, password, plan = "free") => {
    const newUser = {
      email,
      plan, // "free" | "premium"
      createdAt: Date.now()
    };

    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const upgradeToPremium = () => {
    const upgraded = { ...user, plan: "premium" };
    setUser(upgraded);
    localStorage.setItem("user", JSON.stringify(upgraded));
  };

  const value = {
    user,
    isLoggedIn: !!user,
    isPremium: user?.plan === "premium",
    login,
    logout,
    upgradeToPremium,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}