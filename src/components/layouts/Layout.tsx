import React, { ReactNode, useRef, useEffect, useState, useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Head, { HeadProps } from "@/components/layouts/Head";
import { useRouter } from 'next/router';
import styles from "./Layout.module.css";
import Footer from "./Footer"
import Header from "./Header";
import { Loading } from "@/contexts/LoadingContext";
import { Popup } from "@/contexts/PopupContext";
import { defaultPopup, getDisplyedPopup } from "@/templates/PopupTemplates";
import LoadingSpinner from '@/components/LoadingSpinner';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { AlertColor } from '@mui/material/Alert'; // 列挙型のインポート

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
  const [popupDisplay, setPopupDisplay] = useState(defaultPopup);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setPopup(defaultPopup);
  };

  const { loading, setLoading } = useContext(Loading);
  const router = useRouter();

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

  useEffect(() => {
    // ページ遷移を検知するリスナーを設定
    router.events.on('routeChangeStart',  routeChangeStart);
    router.events.on('routeChangeComplete',  routeChangeComplete);

    // コンポーネントがアンマウントされたときにリスナーをクリーンアップ
    return () => {
      router.events.off('routeChangeStart', routeChangeStart);
      router.events.off('routeChangeComplete', routeChangeComplete);
    };
  });

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
        <Footer />
      </ThemeProvider>
    </>
  );
}

export default Layout;