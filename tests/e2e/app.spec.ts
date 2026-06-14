import { test, expect } from "@playwright/test";

test.describe("CodeOrbit App Initial Load", () => {
  test("should load the login gate successfully", async ({ page }) => {
    // Navigate to the base URL (which points to http://localhost:3000)
    await page.goto("/");

    // Verify browser tab title matches
    await expect(page).toHaveTitle(/Bun \+ React/);

    // Verify the Clerk Auth Gate renders the header
    const header = page.locator("h1");
    await expect(header).toHaveText("CodeOrbit Hub");

    // Verify the descriptive helper text
    const description = page.locator("p");
    await expect(description).toHaveText("Please sign in to access your multi-tenant environment workspace.");

    // Verify the Sign In action button is present and visible
    const signInBtn = page.locator("button", { hasText: "Sign In to Workspace" });
    await expect(signInBtn).toBeVisible();
  });
});
