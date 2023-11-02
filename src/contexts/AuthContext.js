import { createContext, useState } from "react";

export const Auth = createContext();

const AuthContext = ({ children }) => {
    const [auth, setAuth] = useState({});
    return (
      <Auth.Provider value={{ auth, setAuth }}>
        {children}
      </Auth.Provider>
    );
  };

export default AuthContext;