import { test, expect } from "@playwright/test";

test.describe("CodeOrbit App Initial Load", () => {
  test("should load the login gate successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Bun \+ React/);

    const header = page.locator("h1").first();
    await expect(header).toHaveText("Orbit Property");

    const description = page.locator(".auth-right p");
    await expect(description).toHaveText("Sign in to manage your real estate portfolio.");

    const signInBtn = page.locator("button", { hasText: "Sign In to Portfolio" });
    await expect(signInBtn).toBeVisible();
  });
});
