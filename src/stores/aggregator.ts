import { create } from "zustand";

export type Report = Partial<{
  total_spend_galactic: number;
  rows_affected: number;
  less_spent_at: number;
  big_spent_at: number;
  // less_spent_value: number;
  big_spent_value: number;
  average_spend_galactic: number;
  big_spent_civ: string;
  less_spent_civ: string;
}>;

export type State = {
  report: Report;
  reports: {
    [key: string]: {
      report: Report | null;
      file: string;
      date: number;
    };
  };
  file: File | null;
  /*
  "start" - начальное состояние
  "error" - произошла ошибка расширение не то или ...
  "fileready" - файл загружен и готов к передаче на сервер
  "parsing" - идет парсинг 
  "finish" - парсинг завершен
  */
  state: "start" | "fileready" | "error" | "parsing" | "finish";
  setFile: (file: File) => void;
  startAggregation: () => Promise<void>;
  reset: () => void;
  cleanReports: () => void;
  addReport: (report: Report | null) => void;
  deleteREport: (id: string) => void;
};

function concatUint8Arrays(array1: Uint8Array, array2: Uint8Array) {
  const result = new Uint8Array(array1.length + array2.length);
  result.set(array1, 0);
  result.set(array2, array1.length);
  return result;
}

const bracketCodeStart = "{".charCodeAt(0);
const bracketCodeEnd = "}".charCodeAt(0);

export const useAggregateStore = create<State>((set, get) => ({
  report: {},
  reports: JSON.parse(localStorage.getItem("reports") || "{}"),
  state: "start",
  file: null,
  setFile: (file: File) => {
    const { addReport } = get();
    if (!file.name.endsWith(".csv")) {
      set({ file });
      addReport(null);
      set({ state: "error" });
      return;
    }
    set({ file, state: "fileready" });
  },
  deleteREport: (id: string) => {
    let { reports } = get();
    delete reports[id];
    reports = {
      ...reports,
    };
    set({
      reports,
    });
    localStorage.setItem("reports", JSON.stringify(reports));
  },
  addReport: (report: Report | null) => {
    let { reports } = get();
    const { file } = get();
    if (!file) return;
    reports = {
      ...reports,
      [Date.now()]: {
        file: file.name,
        report,
        date: Date.now(),
      },
    };
    set({
      reports,
    });
    localStorage.setItem("reports", JSON.stringify(reports));
  },
  startAggregation: async () => {
    const { file, state, addReport } = get();

    if (!file || state !== "fileready") {
      set({ state: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    let res;
    try {
      let rows = 5000;
      const coe = file.size / 150000;
      if (coe > 100 && coe <= 1000) {
        rows = (rows * coe) / 100;
      } else if (coe > 1000) {
        rows = 50000;
      }
      res = await fetch(`http://localhost:3000/aggregate?rows=` + rows, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "text/plain",
        },
      });
    } catch {
      set({ state: "error" });
      addReport(null);

      return;
    }
    if (res && !res.ok) {
      // тут дожна быть обработка ошибок 400 и 500 но...
      set({ state: "error" });
      addReport(null);
      return;
    }
    set({ state: "parsing" });
    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let prev: Uint8Array | null = new Uint8Array(0);
    let report: Report = {};
    while (true) {
      const { value, done } = await reader!.read();
      if (done) break;
      const buff: Uint8Array = prev ? concatUint8Arrays(prev, value) : value;

      const end = buff.lastIndexOf(bracketCodeEnd);
      if (end == -1) {
        prev = buff;
        continue;
      }
      const start = buff.lastIndexOf(bracketCodeStart, end - 1);
      if (start == -1) {
        prev = buff;
        continue;
      }

      try {
        report = JSON.parse(
          decoder.decode(buff.slice(start, end + 1), { stream: true })
        ) as Report;
      } catch {
        prev = value;
        continue;
      }
      prev = value;
      set({ report });
    }
    prev = null;
    addReport(report);
    set({ state: "finish" });
  },
  reset: () => {
    set({
      report: {},
      file: null,
      state: "start",
    });
  },
  cleanReports: () => {
    set({ reports: {} });
    localStorage.setItem("reports", JSON.stringify({}));
  },
}));
