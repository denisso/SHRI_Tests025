import { Routes, Route } from "react-router-dom";
import Analitic from "./pages/Analyst";
import Generator from "./pages/Generator";
import History from "./pages/History";
import ErrorPage from "./pages/ErrorPage";
import Header from "./pages/parts/Header";
import styles from "./App.module.css";

function App() {
  return (
    <>
      <Header />
      <div className={styles.page}>
        <Routes>
          <Route path="/" element={<Analitic />} />
          <Route path="/generator" element={<Generator />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
