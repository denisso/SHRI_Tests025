import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useGeneratorStore } from "../../src/stores/generator.ts";
import { createReadStream } from "fs";
import { Readable } from "stream";

describe("Generator", () => {
  // тестируем генерацию файла
  it("check file generation", async () => {
    const { result } = renderHook(() => useGeneratorStore());
    const filePath = "tests/files/input.csv";
    const nodeStream = createReadStream(filePath);
    const webStream = Readable.toWeb(nodeStream);
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      body: webStream,
    });

    act(() => {
      result.current.resetStream();
    });
    expect(result.current.state).toBe("start");

    act(() => {
      result.current.startStream();
    });
    await new Promise((r) => setTimeout(r, 0));
    expect(result.current.state).toBe("generation");

    waitFor(() => {
      expect(result.current.state).toBe("finish");
    });
  });
});
