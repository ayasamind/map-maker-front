import Head, { HeadProps } from "@/components/layouts/Head";
import { ReactNode } from "react";
import styles from "./Layout.module.css";
import Footer from "./Footer"
import Header from "./Header";

interface LayoutProps extends HeadProps {
    children?: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children, ...props }) => {
    return (
      <>
      <Head title={props.title} description={props.description} />
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
      </>
    );
}

export default Layout;