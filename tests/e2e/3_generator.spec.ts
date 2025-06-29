// Загрузка таблиц с данными и получение аналитики
import { test, expect } from "@playwright/test";

const host = "http://localhost:5173/generator";

const messages = ["Начать генерацию", "Done!"];
// тестируем генерацию тестовых данных для проверки системы
test("generate test data", async ({
  page,
}) => {
  await page.goto(host);

  const btnGenerate = page.locator("#btn-generate");
  expect(btnGenerate).toBeTruthy();
  await expect(btnGenerate).toContainText("Начать генерацию");
  await btnGenerate.click();

  await expect
    .poll(
      async () => {
        const current = (await btnGenerate.textContent())?.trim();
        return current;
      },
      {
        timeout: 20000,
      }
    )
    .toBe(messages.at(-1));
  await btnGenerate.click();
  // Проверяем, что элемент Download был добавлен в DOM
  // await expect(page.locator("#download-url")).toBeAttached();
  // Дополнительно: проверяем, что файл загружается
  // const [download] = await Promise.all([
  //   page.waitForEvent("download"),
  //   page.click("#download-url"),
  // ]);

  // // Проверяем, что файл был загружен
  // expect(download).toBeDefined();
});
