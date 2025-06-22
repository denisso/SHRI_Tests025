import { create } from "zustand";
// тестовые данные
const size = 0.001;
const withErrors = false;
const maxSpend = 1000;

const params = new URLSearchParams({
  size: size.toString(),
  withErrors: withErrors.toString(),
  maxSpend: maxSpend.toString(),
});

export type State = {
  /*
  "start" - начальное состояние
  "error" - произошла ошибка 
  "generation" - файл генерируется
  "finish" - генерация завершена
  */
  result: string;
  state: "start" | "error" | "generation" | "finish";
  startStream: () => void;
  resetStream: () => void;
};

export const useGeneratorStore = create<State>((set, get) => {
  return {
    result: "",
    state: "start",
    startStream: async () => {
      if (get().state != "start") return;

      set({ state: "generation" });

      try {
        const res = await fetch(
          `http://localhost:3000/report?${params.toString()}`,
          {
            headers: {
              Accept: "text/csv",
            },
          }
        );

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();

        const contentDisposition = res.headers.get("Content-Disposition");
        let filename = "report.csv"; // по умолчанию

        if (contentDisposition) {
          const match = /filename="?([^"]+)"?/.exec(contentDisposition);
          if (match) {
            filename = match[1];
          }
        }
        console.log(filename);
        let full = "";

        while (true) {
          const { value, done } = await reader!.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          full += chunk;
          set({ result: full });
        }

        set({ state: "finish" });
      } catch {
        set({ result: "", state: "error" });
      }
    },
    resetStream: () => {
      set({ result: "", state: "start" });
    },
  };
});
