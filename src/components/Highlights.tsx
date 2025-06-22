import React from "react";
import styles from "./Highlights.module.css";
import type { Report } from "../stores/aggregator";

const months = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

function getMonthAndDayFromDayOfYear(dayOfYear: number) {
  const currentYear = new Date().getFullYear();
  const date = new Date(currentYear, 0, 1);

  date.setDate(date.getDate() + dayOfYear);

  const day = date.getDate();
  const month = date.getMonth();

  return `${day} ${months[month]}`;
}

const stateBlank: Report = {
  total_spend_galactic: 0,
  rows_affected: 0,
  less_spent_at: 0,
  big_spent_at: 0,
  // less_spent_value: 0,
  big_spent_value: 0,
  average_spend_galactic: 0,
  big_spent_civ: "",
  less_spent_civ: "",
};

const descs: Record<keyof Report, string> = {
  total_spend_galactic: "общие расходы в галактических кредитах",
  rows_affected: "количество обработанных записей",
  less_spent_at: "день года с минимальными расходами",
  big_spent_at: "день года с максимальными расходами",
  less_spent_civ: "цивилизация с минимальными расходами",
  big_spent_civ: "цивилизация с максимальными расходами",
  big_spent_value: "максимальная сумма расходов за день",
  average_spend_galactic: "средние расходы в галактических кредитах",
};

const order: Array<keyof Report> = [
  "total_spend_galactic",
  "rows_affected",
  "less_spent_at",
  "big_spent_at",
  "big_spent_civ",
  "less_spent_civ",
  "big_spent_value",
  "average_spend_galactic",
];

const Field = ({
  field,
  value,
}: {
  field: keyof Report;
  value?: string | number;
}) => {
  let result = value;
  if (
    (field == "less_spent_at" || field == "big_spent_at") &&
    typeof value == "number"
  ) {
    result = getMonthAndDayFromDayOfYear(value);
  }
  if (field == "average_spend_galactic" && typeof value == "number") {
    result = value.toFixed(2);
  }
  return <div className={styles.value}>{result}</div>;
};

type PropsHighlights = { columns?: number; report?: Report | null };

export default function Highlights({ columns = 2, report }: PropsHighlights) {
  const [state, setState] = React.useState(stateBlank);
  React.useEffect(() => {
    if (!report) return;
    setState((state) => ({ ...state, ...report }));
  }, [report]);
  return (
    <>
      <ul
        className={styles.highligts}
        style={{ "--columns": columns } as React.CSSProperties}
      >
        {order.map((field) => (
          <li className={styles.item} key={field}>
            <Field field={field} value={state[field]} />
            <div className={styles.desc}>{descs[field]}</div>
          </li>
        ))}
      </ul>
    </>
  );
}
