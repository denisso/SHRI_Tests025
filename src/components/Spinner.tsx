import Img from "./Img";
import styles from "./Spinner.module.css";
export default function Spinner() {
  return (
    <div className={styles.spinner}>
      <Img src="spinner.svg" alt="Loading" />
    </div>
  );
}
