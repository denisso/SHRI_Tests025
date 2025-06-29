import { expect, Page } from "@playwright/test";
// проверяемые отображаемые сообщения
const messages = [
  "или перетащите сюда",
  "файл загружен!",
  "идёт парсинг файла",
  "готово!",
];

const host = "http://localhost:5173/";

// Вспомогательная функция для общей логики тестов
export async function uploadFile(
  page: Page,
  filePath: string,
  condition: (num: number) => boolean = (counter) => counter > 0
) {
  await page.goto(host);
  const message = page.locator("#message");
  const btnUpload = page.locator("#btn-send");
  const buttonTag = await btnUpload.evaluate((element) => element.tagName);
  expect(buttonTag.toLowerCase()).toBe("button");

  await page.setInputFiles('input[type="file"]', filePath);
  await page.waitForTimeout(2000);

  await expect(btnUpload).not.toHaveAttribute("disabled");
  await btnUpload.click();
  await page.waitForTimeout(2000);

  const fieldRowsAffected = page.locator("#field-value-rows_affected");
  expect(fieldRowsAffected).toBeTruthy();

  let prevNum = 0;
  let counter = 0;

  await expect
    .poll(
      async () => {
        const current = (await message.textContent())?.trim();
        const text = await fieldRowsAffected.textContent();
        const num = +(text ?? "").trim();
        if (prevNum < num) counter++;
        prevNum = num;
        return current;
      },
      {
        timeout: 20000,
      }
    )
    .toBe(messages.at(-1));

  expect(condition(counter)).toBe(true);
}
