import '@/styles/globals.css'
import 'mapbox-gl/dist/mapbox-gl.css';
import type { AppProps } from 'next/app'
import { useEffect } from 'react';
import AuthContext from '@/contexts/AuthContext';
import LoadingContext from '@/contexts/LoadingContext';
import MapStateContext from '@/contexts/MapStateContext';
import PopupContext from '@/contexts/PopupContext';


export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContext>
      <LoadingContext>
        <PopupContext>
          <MapStateContext>
            <Component {...pageProps} />
          </MapStateContext>
        </PopupContext>
      </LoadingContext>
    </AuthContext>
  )
}
