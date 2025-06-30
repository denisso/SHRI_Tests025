import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAggregateStore } from "../../src/stores/aggregator.ts";
import { createReadStream } from "fs";
import { Readable } from "stream";

describe("History", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  it("check localStorage", async () => {
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

    const filePath = "tests/files/response.txt";
    const nodeStream = createReadStream(filePath);
    const webStream = Readable.toWeb(nodeStream);
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      body: webStream,
    });
    act(() => {
      result.current.startAggregation();
    });
    await waitFor(() => {
      expect(result.current.state).toBe("finish");
    });

    const key = Object.keys(
      JSON.parse(localStorage.getItem("reports") as string)
    )[0];

    // загрузили файл в хранилище +1 отчет
    expect(key).not.toBe(undefined);

    act(() => {
      result.current.deleteReport(key);
    });
    // удалили отчет
    expect(
      Object.keys(JSON.parse(localStorage.getItem("reports") as string)).length
    ).toBe(0);
  });
});
