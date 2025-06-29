// Загрузка таблиц с данными и получение аналитики
import { test, expect, Page, Locator } from "@playwright/test";
import { uploadFile } from "./shared/uploadfile";
// import gotoPage from "./shared/gotopage";
const host = "http://127.0.0.1:5173/history";

const getCountReports = async (page: Page): Promise<number> => {
  const reports = await page.evaluate(() => {
    return localStorage.getItem("reports");
  });
  if (!reports) return 0;
  let count = 0;
  try {
    count = Object.keys(JSON.parse(reports)).length;
  } catch {
    return 0;
  }

  return count;
};

const getChildren = (locator: Locator) => {
  return locator.evaluate((node: HTMLDivElement) => {
    return node.children;
  });
};

const testAddReport = async (page: Page) => {
    await page.goto(host);
//   await gotoPage(page, host);
  // Чтение отчетов из localStorage
  const countStorage = await getCountReports(page);
  const reports = page.locator("#reports");
  expect(reports).toBeTruthy();
  let children = await getChildren(reports)
  const countElements = children.length;
  await uploadFile(page, "./tests/files/input.csv");
//   await gotoPage(page, host);
    await page.goto(host);
  children = await getChildren(reports)
  expect(await getCountReports(page)).toBe(countStorage + 1);
  expect((await getChildren(reports)).length).toBe(countElements + 1);
};

// тест добавления отчета
test("test add report", async ({ page }) => {
  await testAddReport(page);
});

// "тест удаления отчета"
test("test delete report", async ({ page }) => {
  await testAddReport(page);
  const reports = page.locator("#reports");
  const children = await getChildren(reports);
  expect(children.length).toBe(1);
  const btnTrash = children[0].children[1] as HTMLButtonElement;
  btnTrash.click();
  expect(await getCountReports(page)).toBe(0);
  expect((await getChildren(reports)).length).toBe(0);
});
