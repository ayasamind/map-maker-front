import React, { ReactNode, useEffect, useState, useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Head, { HeadProps } from "@/components/layouts/Head";
import { useRouter } from 'next/router';
import styles from "./Layout.module.css";
import Header from "./Header";
import { Loading } from "@/contexts/LoadingContext";
import { Auth } from "@/contexts/AuthContext";
import { Popup } from "@/contexts/PopupContext";
import { defaultPopup, getDisplyedPopup } from "@/templates/PopupTemplates";
import LoadingSpinner from '@/components/LoadingSpinner';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { AlertColor } from '@mui/material/Alert';
import firebaseAuth from '@/libs/firebaseAuth';
import { onAuthStateChanged } from "firebase/auth";
import axios from "@/libs/axios"
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { AxiosResponse, AxiosError } from 'axios'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface LayoutProps extends HeadProps {
    children?: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children, ...props }) => {
  const theme = createTheme();
  const { popup, setPopup } = useContext(Popup);
  const { auth, setAuth } = useContext(Auth);
  const [popupDisplay, setPopupDisplay] = useState(defaultPopup);
  const { loading, setLoading } = useContext(Loading);
  const router = useRouter();

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setPopup(defaultPopup);
    setPopupDisplay(defaultPopup);
  };

  useEffect(() => {
    try {
      onAuthStateChanged(firebaseAuth, async (user) => {
        setLoading(true)
        if (user && Object.keys(auth).length === 0) {
          const idToken = await user.getIdToken();
          await axios.get("/users/me", {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          }).then((res: AxiosResponse) => {
            setAuth({
              ...auth,
              user: {
                name: res.data.user.name,
                email: res.data.user.email,
                image_url: res.data.user.image_url,
              }
            })
          }).catch(async (error: AxiosError) => {

          });
        }
        setLoading(false)
      });
    } catch (error) {
      throw error
    }

    // ページ遷移が発生した際に実行されるコード
    const routeChangeStart = (url: string) => {
      setLoading(true);
    };

    // ページ遷移が発生した際に実行されるコード
    const routeChangeComplete = (url: string) => {
      setLoading(false);
      if (popup.displayed) {
        setPopup(defaultPopup);
      } else if (popup.display) {
        setPopupDisplay(popup);
        setPopup(getDisplyedPopup(popup));
      }
    };

    // ページ遷移を検知するリスナーを設定
    router.events.on('routeChangeStart',  routeChangeStart);
    router.events.on('routeChangeComplete',  routeChangeComplete);

    // コンポーネントがアンマウントされたときにリスナーをクリーンアップ
    return () => {
      router.events.off('routeChangeStart', routeChangeStart);
      router.events.off('routeChangeComplete', routeChangeComplete);
    };
  }, [auth, setAuth, setLoading, router, popup, setPopup, setPopupDisplay]);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Head title={props.title} description={props.description} />
        <Header />
        <Snackbar open={popup.suddenDisplay} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={popup.type as AlertColor} sx={{ width: '100%' }}>
            {popup.message}
          </Alert>
        </Snackbar>
        <Snackbar open={popupDisplay.display} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={popupDisplay.type as AlertColor} sx={{ width: '100%' }}>
            {popupDisplay.message}
          </Alert>
        </Snackbar>
        {loading && <LoadingSpinner />}
        <main className={styles.main}>{children}</main>
      </ThemeProvider>
    </>
  );
}

export default Layout;