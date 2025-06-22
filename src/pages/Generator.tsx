import React from "react";
import { useGeneratorStore } from "../stores/generator";
import type { State } from "../stores/generator";
import Img from "../components/Img";
import styles from "./Generator.module.css";
import Spinner from "../components/Spinner";

const Download = () => {
  const result = useGeneratorStore((state) => state.result);
  const ref = React.useRef(false);
  React.useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const blob = new Blob([result], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.csv";
    document.body.appendChild(a);
    a.click();

    URL.revokeObjectURL(url);
    a.remove();
  }, [result]);
  return null;
};

const btnTexts: Record<State["state"], string> = {
  start: "Начать генерацию",
  error: "Произошла ошибка",
  generation: "",
  finish: "Done!",
};

const ButtonGenerate = () => {
  const state = useGeneratorStore((state) => state.state);
  const startStream = useGeneratorStore((state) => state.startStream);
  const [show, setShow] = React.useState(false);

  const handleClick = () => {
    if (state == "start") {
      startStream();
    } else if (state == "finish") {
      setShow(true);
    }
  };

  return (
    <>
      <button
        className={`${styles.btn} ${styles[state]}`}
        onClick={handleClick}
      >
        {state == "generation" ? <Spinner /> : btnTexts[state]}
      </button>
      {show && state == "finish" && <Download />}
    </>
  );
};

const ButtonCancel = () => {
  const state = useGeneratorStore((state) => state.state);
  const resetStream = useGeneratorStore((state) => state.resetStream);
  return state == "finish" || state == "error" ? (
    <button className={`${styles.btn} ${styles.close}`} onClick={resetStream}>
      <Img src="btn-crosshair.svg" />
    </button>
  ) : (
    <></>
  );
};

const texts: Record<State["state"], string> = {
  start: "",
  error: "произошла ошибка",
  generation: "идёт процесс генерации",
  finish: "файл сгенерирован!",
};

const Text = () => {
  const state = useGeneratorStore((state) => state.state);
  return <div className={styles.text}>{texts[state]}</div>;
};
export default function Generator() {
  return (
    <div className={styles.page}>
      <div className={styles.message}>
        Сгенерируйте готовый csv-файл нажатием одной кнопки
      </div>
      <div className={styles.buttons}>
        <ButtonGenerate />
        <ButtonCancel />
      </div>
      <Text />
    </div>
  );
}
