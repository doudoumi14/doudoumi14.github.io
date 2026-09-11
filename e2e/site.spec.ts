import { expect, test } from "@playwright/test";
import { profile } from "../data/profile";
import { experience } from "../data/experience";
import { projects } from "../data/projects";

test.describe("Portfolio site", () => {
  test("renders the owner's name and title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(`${profile.name}, ${profile.credential}`);
    await expect(
      page.getByRole("heading", { name: new RegExp(`${profile.name}, ${profile.credential}`) }),
    ).toBeVisible();
    await expect(page.getByText(profile.role)).toBeVisible();
  });

  test("lists every employer from the experience section", async ({ page }) => {
    await page.goto("/");
    for (const role of experience) {
      await expect(page.getByRole("heading", { name: role.company })).toBeVisible();
    }
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

  test("exposes contact links: LinkedIn, email, and GitHub", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(`a[href="mailto:${profile.email}"]`).first()).toBeVisible();
    await expect(page.locator(`a[href="${profile.linkedin}"]`).first()).toBeVisible();
    await expect(
      page.locator(`a[href="https://github.com/${profile.github}"]`).first(),
    ).toBeVisible();
  });

  test("does not publish a phone number", async ({ page }) => {
    await page.goto("/");
    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/\+?\d[\d\s().-]{7,}\d/);
  });

  test("every section anchor the nav points at exists", async ({ page }) => {
    await page.goto("/");
    const hrefs = await page
      .locator("header a[href^='#']")
      .evaluateAll((els) => els.map((e) => e.getAttribute("href")!));

    expect(hrefs.length).toBeGreaterThan(0);
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

  test("the brand name in the nav never breaks mid-word, even on a phone viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const brand = page.locator('header a[href="#top"]');
    const box = await brand.boundingBox();
    const lineHeight = await brand.evaluate((el) => parseFloat(getComputedStyle(el).lineHeight));
    // A wrapped name renders across two lines and is roughly 2x as tall; a
    // single line should be well under 1.5x the computed line-height.
    expect(box!.height).toBeLessThan(lineHeight * 1.5);
  });
});
