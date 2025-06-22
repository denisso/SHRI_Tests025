import { NavLink } from "react-router-dom";
import Img from "./Img";
import styles from "./Navbar.module.css";

const NavButton = ({
  to,
  text,
  icon,
}: {
  to: string;
  text: string;
  icon: string;
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? `${styles.link} ${styles.active}` : styles.link
      }
    >
      <Img src={icon} /> {text}
    </NavLink>
  );
};

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <NavButton to="/" text="CSV Аналитик" icon="btn-analitic.svg" />
      <NavButton
        to="/generator"
        text="CSV Генератор"
        icon="btn-generator.svg"
      />
      <NavButton to="/history" text="История" icon="btn-history.svg" />
    </nav>
  );
}
