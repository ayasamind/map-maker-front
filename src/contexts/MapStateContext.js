import { createContext, useState } from "react";
import { defaultMapState } from "@/templates/MapStateTemplates";

export const MapState = createContext();

function MapStateContext({ children }) {
    const [mapState, setMapState] = useState(defaultMapState);
    return (
      <MapState.Provider value={{ mapState, setMapState }}>
        {children}
      </MapState.Provider>
    );
}

export default MapStateContext;