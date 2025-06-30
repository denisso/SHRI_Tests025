import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAggregateStore } from "../../src/stores/aggregator.ts";
import { createReadStream } from "fs";
import { Readable } from "stream";

describe("useAggregateStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // установка файла и проверка состояний и проверка
  // Реализация запроса с постепенным получением данных
  it("set file and check states", async () => {
    const { result } = renderHook(() => useAggregateStore());
    act(() => {
      result.current.reset();
    });
    // 	изначально state в состоянии state == "start"
    await waitFor(() => {
      expect(result.current.state).toBe("start");
    });
    const file = new File([""], "file.csv", { type: "text/csv" });
    // начинаем работу задаем файл
    act(() => {
      result.current.setFile(file);
    });
    // как только зада файл состояние меняется на fileready
    expect(result.current.file?.name).toBe("file.csv");
    expect(result.current.state).toBe("fileready");
    // тестовый пример ответа от сервера
    const filePath = "tests/files/response.txt";
    const nodeStream = createReadStream(filePath);
    const webStream = Readable.toWeb(nodeStream);
    // мокаем глобальный fetch для того чтобы имитировать
    // передачу данных от сервера внутри хука useAggregateStore
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      body: webStream,
    });
    // стартуем поток получения данных от сервера
    act(() => {
      result.current.startAggregation();
    });
    await new Promise((r) => setTimeout(r, 0));
    // состояние становится parsing
    expect(result.current.state).toBe("parsing");

    let prev = 0,
      counter = 0;
    while (result.current.state === "parsing") {
      await new Promise((r) => setTimeout(r, 0));

      expect(result.current.report.rows_affected ?? 0).toBeGreaterThanOrEqual(
        prev
      );

      counter++;
      prev = result.current.report.rows_affected ?? 0;
    }
    // было срабатоывание как минимум два раза значит есть 
    // Реализация запроса с постепенным получением данных
    expect(counter).toBeGreaterThan(2);
  });

  // крайний слйчай тестируем неправильный файл
  it("test wrong file", async () => {
    const { result } = renderHook(() => useAggregateStore());

    act(() => {
      result.current.reset();
    });

    await waitFor(() => {
      expect(result.current.state).toBe("start");
    });

    const file = new File([""], "file.txt", { type: "text/csv" });
    // начинаем работу задаем файл
    act(() => {
      result.current.setFile(file);
    });
    // состояние должно поменяться на error
    expect(result.current.state).toBe("error");
  });
});
