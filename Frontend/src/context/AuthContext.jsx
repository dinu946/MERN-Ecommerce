import React, {
  createContext,
  useEffect,
  useState,
} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("userinfo");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData, token) => {
    setUser(userData);

    localStorage.setItem(
      "userinfo",
      JSON.stringify(userData)
    );

    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem("userinfo");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};