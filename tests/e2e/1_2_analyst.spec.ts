// Загрузка таблиц с данными и получение аналитики
import { test, expect } from "@playwright/test";
import { uploadFile } from "./shared/uploadfile";
const host = "http://localhost:5173/";

// проверяемые отображаемые сообщения
const messages = [
  "или перетащите сюда",
  "файл загружен!",
  "идёт парсинг файла",
  "готово!",
];
// "тестируем измнения состояния загрузки файла"
test("file upload messages changes", async ({ page }) => {
  // Открываем вашу веб-страницу
  await page.goto(host);

  const message = page.locator("#message");
  // элемент существует
  expect(message).toBeTruthy();
  // и содержит правильный текст
  expect(message).toContainText(messages[0]);

  const btnUpload = page.locator("#btn-send");
  // кнопка отправки файла существвует
  const buttonTag = await btnUpload.evaluate((element) => element.tagName);
  expect(buttonTag.toLowerCase()).toBe("button");

  await page.setInputFiles('input[type="file"]', "./tests/files/input.csv");
  await page.waitForTimeout(4000); // Ждем 4 секунды
  //
  await expect(message).toContainText(messages[1]);

  // кнопку отправить можно нажать
  await expect(btnUpload).not.toHaveAttribute("disabled");

  await btnUpload.click();
  const messagesSet = new Set();
  // получаем остальные сообщения
  await expect
    .poll(
      async () => {
        const current = (await message.textContent())?.trim();
        messagesSet.add(current);
        return current;
      },
      {
        timeout: 20000,
      }
    )
    .toBe(messages.at(-1));
  for (let i = 1; i < messages.length; i++) {
    expect(messagesSet.has(messages[i])).toBe(true);
  }
});
// тестируем реализацию запроса с постепенным получением данных
test("query with gradual data output", async ({
  page,
}) => {
  await uploadFile(
    page,
    "./tests/files/input.csv",
    (counter) => counter > 0
  );
});

// тестируем крайний случай отправка файла нулевой длины без данных
test("ending case a zero-length file", async ({
  page,
}) => {
  await uploadFile(
    page,
    "./tests/files/zero.csv",
    (counter) => counter === 0
  );
});
