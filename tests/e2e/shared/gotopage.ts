import { expect, Page } from "@playwright/test";

export default async function (page: Page, host: string) {
  // Используем метод goto с ожиданием загрузки страницы
  await page.goto(host, { waitUntil: "domcontentloaded" });

  // Дополнительное ожидание, если необходимо
  await page.waitForLoadState("networkidle");

  // Проверяем, что страница загружена
  await expect(page).toHaveURL(host);
}
