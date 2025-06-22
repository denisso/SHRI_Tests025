import FileUpload from "../components/FileUpload";
import Highlights from "../components/Highlights";
import { useAggregateStore } from "../stores/aggregator";
import styles from "./Analyst.module.css";

const Result = () => {
  const report = useAggregateStore((store) => store.report);
  const state = useAggregateStore((store) => store.state);
  const isShow = state == "parsing" || state == "finish";
  return (
    <div className={styles.results}>
      {isShow ? (
        <Highlights report={report} />
      ) : (
        <span className={styles.message}>
          Здесь
          <br />
          появятся хайлайты
        </span>
      )}
    </div>
  );
};

export default function Analyst() {
  return (
    <div className={styles.box}>
      <FileUpload />
      <Result />
    </div>
  );
}
