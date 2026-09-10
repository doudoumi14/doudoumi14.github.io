import { expect, test } from "@playwright/test";
import { profile } from "../data/profile";
import { projects } from "../data/projects";

test.describe("Portfolio site", () => {
  test("renders the owner's name and role", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(`${profile.name} — Full-stack developer`);
    await expect(page.getByRole("heading", { name: new RegExp(profile.name) })).toBeVisible();
    await expect(page.getByText(profile.role).first()).toBeVisible();
  });

  test("lists every project with a working repo link", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator("#projects a");
    await expect(cards).toHaveCount(projects.length);

    const hrefs = await cards.evaluateAll((els) => els.map((e) => (e as HTMLAnchorElement).href));
    for (const project of projects) {
      expect(hrefs).toContain(`https://github.com/${profile.github}/${project.repo}`);
    }
  });

  test("exposes a contact email", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(`a[href="mailto:${profile.email}"]`).first()).toBeVisible();
  });

  test("every section anchor the nav points at exists", async ({ page }) => {
    await page.goto("/");
    const hrefs = await page
      .locator("header a[href^='#']")
      .evaluateAll((els) => els.map((e) => e.getAttribute("href")!));

    for (const href of hrefs) {
      await expect(page.locator(href)).toHaveCount(1);
    }
  });

  test("the nav stays pinned while scrolling", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(300);
    const box = await page.locator("header").boundingBox();
    expect(Math.abs(box!.y)).toBeLessThan(2);
  });

  test("has no horizontal overflow on a phone viewport", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflows).toBe(false);
  });
});
