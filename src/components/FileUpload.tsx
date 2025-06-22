import React from "react";
import Img from "./Img";
import Spinner from "./Spinner";
import styles from "./FileUpload.module.css";
import { useAggregateStore } from "../stores/aggregator";
import type { State } from "../stores/aggregator";

const ButtonClose = () => {
  const state = useAggregateStore((store) => store.state);
  const reset = useAggregateStore((store) => store.reset);

  return state == "finish" || state == "error" || state == "fileready" ? (
    <button className={styles["btn-close"]} onClick={reset}>
      <Img src="btn-crosshair.svg" />
    </button>
  ) : (
    <></>
  );
};

const texts: Record<State["state"], string> = {
  start: "или перетащите сюда",
  error: "упс, не то...",
  parsing: "идёт парсинг файла",
  fileready: "файл загружен!",
  finish: "готово!",
};

const ButtonFile = ({
  state,
  setFile,
}: {
  state: State["state"];
  setFile: State["setFile"];
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const file = useAggregateStore((store) => store.file);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (state !== "start") return;
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  React.useEffect(() => {
    if (state == "start") {
      if (inputRef.current) inputRef.current.value = "";
    }
  }, [state]);
  const filename = file ? file.name : "";

  let btnText = state == "start" ? "Загрузить файл" : filename;
  if (state === "parsing") btnText = "";
  return (
    <>
      <div className={styles["area-btns"]}>
        <button
          className={`${styles["btn-file"]} ${styles[state]}`}
          onClick={() => {
            if (state !== "start") return;
            if (inputRef.current) inputRef.current.click();
          }}
        >
          {state == "parsing" ? <Spinner /> : btnText}
        </button>
        <input
          type="file"
          className={styles["input-file"]}
          ref={inputRef}
          onChange={handleChange}
        />
        <ButtonClose />
      </div>

      <div>{texts[state]}</div>
    </>
  );
};

const UploadArea = () => {
  const [dragActive, setDragActive] = React.useState(false);
  const setFile = useAggregateStore((state) => state.setFile);
  const state = useAggregateStore((store) => store.state);
  React.useEffect(() => {
    if (state != "start") setDragActive(false);
  }, [state]);
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    if (state !== "start") return;
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (state !== "start") return;
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  let areaStyle = styles["file-area"];
  if (dragActive) areaStyle += " " + styles["active"];
  if (state != "start") areaStyle += " " + styles["uploaded"];
  return (
    <div
      className={areaStyle}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <ButtonFile state={state} setFile={setFile} />
    </div>
  );
};

function ButtonUpload() {
  const state = useAggregateStore((store) => store.state);
  const startAggregation = useAggregateStore((store) => store.startAggregation);
  const isActive = state === "fileready";
  const shouldRenderButton = state === "fileready" || state === "start";

  return shouldRenderButton ? (
    <button
      className={`${styles["btn-send"]} ${isActive ? styles["active"] : ""}`}
      onClick={() => {
        if (state !== "fileready") return;
        startAggregation();
      }}
      disabled={!isActive}
    >
      Отправить
    </button>
  ) : null;
}

export default function FileUpload() {
  return (
    <div className={styles.element}>
      <div className={styles["element-message"]}>
        Загрузите <b>csv</b> файл и получите <b>полную информацию</b> о нём за
        сверхнизкое время
      </div>
      <UploadArea />
      <ButtonUpload />
    </div>
  );
}
