import { ReactNode } from "react";
import styles from "./Footer.module.css";

interface FooterProps {
  children?: ReactNode
}

const Footer: React.FC = (props: FooterProps) => {
  return (
    <footer className={styles.footer}>
      <span>&copy; LIGHT</span>
    </footer>
  )
}

export default Footer
