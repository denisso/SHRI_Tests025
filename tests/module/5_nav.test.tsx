import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../../src/components/Navbar";

const links = ["CSV Аналитик", "CSV Генератор", "История"];
const hrefs = ["/", "/generator", "/history"];

describe("Navigation in App", () => {
  // "находим все ссылки в navbar и правильность атрибутов"
  it("test nav menu", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Navbar />
      </MemoryRouter>
    );
    for (let i = 0; i < links.length; i++) {
      const name = links[i];
      const link = screen.getByRole("link", { name });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", hrefs[i]);
    }
  });
});
