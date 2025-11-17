import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthFormProvider({ children }) {
  const [isStudent, setIsStudent] = useState(true);
  const [isLogin, setIsLogin] = useState(true);

  // Form fields
  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [section, setSection] = useState("");
  const [password, setPassword] = useState("");
 
  return (
    <AuthContext.Provider
      value={{
        isStudent,
        setIsStudent,
        isLogin,
        setIsLogin,

        id,
        setId,
        email,
        setEmail,
        course,
        setCourse,
        section,
        setSection,
        password,
        setPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthFormContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthFormContext must be used inside AuthFormProvider");
  }
  return context;
};
