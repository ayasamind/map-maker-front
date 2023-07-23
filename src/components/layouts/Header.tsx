import { ReactNode } from "react";
import Image from "next/image"
import styles from "./Header.module.css";

interface HeaderProps {
  children?: ReactNode
}

const Header: React.FC = (props: HeaderProps) => {
  return (
    <header className={styles.header}>
      <Image className={styles.Image} src="/images/logo.png" alt="my icon" width={35} height={35} />
      <h1 className={styles.h1}>LIGHT Map</h1>
    </header>
  )
}

export default Header
