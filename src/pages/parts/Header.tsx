import Navbar from "../../components/Navbar";
import Img from "../../components/Img";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <a href="https://yandex.ru/yaintern/schools/summer" target="_blank">
          <Img src="schools.svg" alt="Летние школы" className="logo-img" />
        </a>

        <div className={styles.title}>Межгалактическая аналитика</div>
      </div>
      <div className={styles.right}>
        <Navbar />
      </div>
    </header>
  );
}
