import Image from "next/image";

import styles from "./page.module.css";
import Lumina from "./pages/lumina";

export default function Home() {
  return (
    <div className={styles.page}>
      <Lumina/>
    </div>
  );
}
