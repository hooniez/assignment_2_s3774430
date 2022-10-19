import React from "react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={`mt-auto py-3 bg-dark text-white ${styles.border}`}>
      <div className="container">LAN Admin &copy; 2022</div>
    </footer>
  );
}
