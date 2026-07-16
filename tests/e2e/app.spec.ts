import { test, expect } from "@playwright/test";

test.describe("App Initial Load", () => {
  test("should load the application successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Bun \+ React/);

    const header = page.locator("h1").first();
    await expect(header).toHaveText("New Project");

    const description = page.locator("p").first();
    await expect(description).toHaveText("Configuration and infrastructure preserved.");
  });
});
