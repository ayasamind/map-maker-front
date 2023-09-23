import { createContext, useState } from "react";

export const Loading = createContext();

function LoadingContext({ children }) {
    const [loading, setLoading] = useState(false);
    return (
      <Loading.Provider value={{ loading, setLoading }}>
        {children}
      </Loading.Provider>
    );
}

export default LoadingContext;