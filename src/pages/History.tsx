import React from "react";
import { NavLink } from "react-router-dom";
import Img from "../components/Img";
import Modal from "../components/Modal";
import Highlights from "../components/Highlights";
import { useAggregateStore } from "../stores/aggregator";
import type { Report } from "../stores/aggregator";
import styles from "./History.module.css";

const dateToString = (num: number) => {
  const date = new Date(num);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

export default function History() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [report, setReport] = React.useState<Report | null>(null);
  const reports = useAggregateStore((store) => store.reports);
  const cleanReports = useAggregateStore((store) => store.cleanReports);
  const deleteREport = useAggregateStore((store) => store.deleteREport);
  return (
    <div className={styles.page}>
      <div className={styles.reports} id="reports">
        {Object.keys(reports).map((key) => (
          <div key={reports[key].date} className={styles.report}>
            <button
              className={styles.data}
              onClick={() => {
                if (!reports[key].report) return;
                setReport(reports[key].report);
                setIsModalOpen(true);
              }}
            >
              <div className={styles.field}>
                <Img src="file.svg" /> {reports[key].file}
              </div>
              <div className={styles.field}>
                {dateToString(reports[key].date)}
              </div>
              <div
                className={
                  styles.field +
                  (!reports[key].report ? " " + styles.inactive : "")
                }
              >
                Обработан успешно <Img src="success.svg" />
              </div>
              <div
                className={
                  styles.field +
                  (reports[key].report ? " " + styles.inactive : "")
                }
              >
                Не удалось обработать <Img src="fail.svg" />
              </div>
            </button>
            <button
              className={styles["btn-trash"]}
              onClick={() => deleteREport(key)}
            >
              <Img src="btn-trash.svg" alt="trash" />
            </button>
          </div>
        ))}
      </div>
      <div className={styles.buttons}>
        <NavLink to="/" className={`${styles.btn} ${styles["btn-more"]}`}>
          Сгенерировать больше
        </NavLink>
        <button
          className={`${styles.btn} ${styles["btn-clean"]}`}
          onClick={cleanReports}
        >
          Очистить все
        </button>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Highlights report={report} columns={1} />
      </Modal>
    </div>
  );
}
