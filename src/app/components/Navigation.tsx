"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        <h1 className={styles.logo}>📋 Gerador de Documentos</h1>
        <div className={styles.navLinks}>
          <Link 
            href="/" 
            className={`${styles.navLink} ${pathname === "/" ? styles.active : ""}`}
          >
            📊 Relatório T.I
          </Link>
          <Link 
            href="/contrato" 
            className={`${styles.navLink} ${pathname === "/contrato" ? styles.active : ""}`}
          >
            📄 Contrato
          </Link>
        </div>
      </div>
    </nav>
  );
} 