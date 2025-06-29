import { test, expect } from "@playwright/test";

const host = "http://localhost:5173/";

// тест навигационное меню для перемещения между разделами
test("navigation", async ({ page }) => {
  // Открываем вашу веб-страницу
  await page.goto(host);

  // Проверяем, что начальный URL соответствует ожидаемому
  await expect(page).toHaveURL(host);

  // Находим и кликаем по ссылке "CSV Генератор"
  await page.click('a[href="/generator"]');

  // Проверяем, что URL изменился на /generator
  await expect(page).toHaveURL(host + "generator");

  // Находим и кликаем по ссылке "История"
  await page.click('a[href="/history"]');

  // Проверяем, что URL изменился на /history
  await expect(page).toHaveURL(host + "history");

  // Находим и кликаем по ссылке "История"
  await page.click('a[href="/"]');

  // Проверяем, что  URL соответствует начальному
  await expect(page).toHaveURL(host);
});
