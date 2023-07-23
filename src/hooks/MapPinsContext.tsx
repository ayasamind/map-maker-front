import React, { createContext, useContext, useEffect, useState } from 'react';
import { MarkerProps } from '@/components/map/Marker';

const mapPinsContext = createContext<MarkerProps[]>([]);
const setMapPinsContext = createContext<React.Dispatch<React.SetStateAction<MarkerProps[]>>>(() => {});

export const MapPinsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mapPins, setMapPins] = useState<MarkerProps[]>([]);

  return (
    <mapPinsContext.Provider value={mapPins}>
      <setMapPinsContext.Provider value={setMapPins}>
        {children}
      </setMapPinsContext.Provider>
    </mapPinsContext.Provider>
  )
}

export const useMapPins = (): MarkerProps[] => useContext(mapPinsContext);
export const useSetMapPins = () : React.Dispatch<React.SetStateAction<MarkerProps[]>> => useContext(setMapPinsContext);
