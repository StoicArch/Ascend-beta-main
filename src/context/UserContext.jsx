import React, { createContext, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("ascend-user")) || {}
  );

  const updateUser = (data) => {

    setUser((prev) => {
      const updated = { ...prev, ...data };

      localStorage.setItem(
        "ascend-user",
        JSON.stringify(updated)
      );

      return updated;
    });

  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}