import { expect, test, type Page } from "@playwright/test";
import { profile } from "../data/profile";
import { experience } from "../data/experience";
import { projects } from "../data/projects";

// Keyboard shortcuts only work once the client bundle has hydrated and
// attached its listeners. The hero canvas gets its backing size in an effect,
// so a non-zero width is a genuine "client JS has run" signal — more reliable
// than sleeping for an arbitrary interval.
async function waitForHydration(page: Page) {
  await page.waitForFunction(() => {
    const canvas = document.querySelector("#top canvas") as HTMLCanvasElement | null;
    return !!canvas && canvas.width > 0;
  });
}

// Even after hydration, a keypress can land in the gap before a given
// component's listener is attached — and a missed keypress is simply lost, not
// queued. So retry the trigger until its effect is observable rather than
// pressing once and hoping.
async function pressUntil(page: Page, keys: string[], expectation: () => Promise<unknown>) {
  await expect(async () => {
    for (const key of keys) await page.keyboard.press(key);
    await expectation();
  }).toPass({ timeout: 15000 });
}

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

  test("all sections become visible after scrolling through the page", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(async () => {
      document.documentElement.style.scrollBehavior = "auto";
      const step = Math.floor(window.innerHeight * 0.6);
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
    });

    // Nothing may be left stuck at opacity 0 by the scroll-reveal. Polled
    // rather than asserted once: the reveal is a 600ms fade, so the last
    // element to come into view is legitimately mid-transition right after
    // the scroll finishes.
    await expect
      .poll(
        () =>
          page.evaluate(
            () =>
              Array.from(document.querySelectorAll(".reveal")).filter(
                (el) => parseFloat(getComputedStyle(el).opacity) < 0.9,
              ).length,
          ),
        { timeout: 5000 },
      )
      .toBe(0);
  });

  test("content is still visible when the reveal script never runs", async ({ page }) => {
    await page.goto("/");
    // Simulates JS failing to boot: without .js-reveal the content must render
    // normally rather than staying permanently invisible.
    await page.evaluate(() => document.documentElement.classList.remove("js-reveal"));
    const opacity = await page
      .locator("#contact .reveal")
      .first()
      .evaluate((el) => parseFloat(getComputedStyle(el).opacity));
    expect(opacity).toBe(1);
  });

  test("the impact metrics count up to their final values", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("99.9%", { exact: true })).toBeVisible();
    await expect(page.getByText("90%", { exact: true }).first()).toBeVisible();
  });

  test("the theme toggle switches between light and dark", async ({ page }) => {
    await page.goto("/");
    const isDark = () => page.evaluate(() => document.documentElement.classList.contains("dark"));
    const before = await isDark();

    await page.getByRole("button", { name: /toggle colour theme/i }).click();
    expect(await isDark()).toBe(!before);

    // And it survives a reload, i.e. the choice was persisted.
    await page.reload();
    expect(await isDark()).toBe(!before);
  });

  test("the nav highlights nothing while the hero is in view", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header a[aria-current='true']")).toHaveCount(0);

    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      document.getElementById("projects")?.scrollIntoView();
    });
    await expect(page.locator('header a[aria-current="true"]')).toHaveText("Projects");
  });

  test("the terminal opens with '/', runs commands, and closes with Escape", async ({ page }) => {
    await page.goto("/");
    await waitForHydration(page);

    const dialog = page.getByRole("dialog", { name: /terminal/i });
    await pressUntil(page, ["/"], () => expect(dialog).toBeVisible({ timeout: 1500 }));

    const input = page.getByLabel("Terminal input");
    await input.fill("whoami");
    await input.press("Enter");
    await expect(dialog).toContainText(profile.role);

    await input.fill("projects");
    await input.press("Enter");
    for (const project of projects) {
      await expect(dialog).toContainText(project.name);
    }

    await input.fill("clear");
    await input.press("Enter");
    await expect(dialog).not.toContainText(profile.role);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("an unknown terminal command reports itself rather than failing silently", async ({
    page,
  }) => {
    await page.goto("/");
    await waitForHydration(page);
    const input = page.getByLabel("Terminal input");
    await pressUntil(page, ["/"], () => expect(input).toBeVisible({ timeout: 1500 }));
    await input.fill("definitely-not-a-command");
    await input.press("Enter");
    await expect(page.getByRole("dialog")).toContainText("command not found");
  });

  test("terminal history and tab-completion work", async ({ page }) => {
    await page.goto("/");
    await waitForHydration(page);
    const input = page.getByLabel("Terminal input");
    await pressUntil(page, ["/"], () => expect(input).toBeVisible({ timeout: 1500 }));

    await input.fill("skills");
    await input.press("Enter");
    await input.press("ArrowUp");
    await expect(input).toHaveValue("skills");

    await input.fill("");
    await input.fill("exp");
    await input.press("Tab");
    await expect(input).toHaveValue("experience");
  });

  test("the hero network canvas renders", async ({ page }) => {
    await page.goto("/");
    const canvas = page.locator("#top canvas");
    await expect(canvas).toHaveCount(1);
    // A painted canvas has non-zero backing dimensions.
    const size = await canvas.evaluate((el) => {
      const c = el as HTMLCanvasElement;
      return { w: c.width, h: c.height };
    });
    expect(size.w).toBeGreaterThan(0);
    expect(size.h).toBeGreaterThan(0);
  });

  test("the scroll progress bar advances as the page scrolls", async ({ page }) => {
    await page.goto("/");
    const bar = page.locator("div.origin-left").first();
    const scaleAt = async () =>
      bar.evaluate((el) => {
        const m = new DOMMatrixReadOnly(getComputedStyle(el).transform);
        return m.a;
      });

    const atTop = await scaleAt();
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, document.documentElement.scrollHeight);
    });
    await page.waitForTimeout(300);
    expect(await scaleAt()).toBeGreaterThan(atTop);
  });

  test("the Konami code unlocks the easter egg", async ({ page }) => {
    await page.goto("/");
    await waitForHydration(page);
    // Case-insensitive: the label is rendered through a CSS uppercase
    // transform, which innerText reflects.
    await pressUntil(
      page,
      ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"],
      () => expect(page.getByText(/achievement unlocked/i)).toBeVisible({ timeout: 1500 }),
    );
    await expect(page.getByText(/curiosity/i)).toBeVisible();
  });

  test("career mode lists a level per role and opens a brief", async ({ page }) => {
    await page.goto("/");
    await waitForHydration(page);

    await page.getByRole("button", { name: /play my career/i }).click();
    const game = page.getByRole("dialog", { name: "Career mode" });
    await expect(game).toBeVisible();

    for (const role of experience) {
      await expect(game.getByText(role.company, { exact: true })).toBeVisible();
    }

    await game.getByRole("button", { name: /Bell/ }).first().click();
    await expect(game.getByRole("button", { name: "Start level" })).toBeVisible();
  });

  test("starting a level renders the playable canvas and its controls", async ({ page }) => {
    await page.goto("/");
    await waitForHydration(page);
    await page.getByRole("button", { name: /play my career/i }).click();
    const game = page.getByRole("dialog", { name: "Career mode" });

    await game.getByRole("button", { name: /CAE/ }).first().click();
    await game.getByRole("button", { name: "Start level" }).click();

    const canvas = game.locator("canvas");
    await expect(canvas).toBeVisible();
    const size = await canvas.evaluate((el) => {
      const c = el as HTMLCanvasElement;
      return { w: c.width, h: c.height };
    });
    expect(size.w).toBeGreaterThan(0);
    expect(size.h).toBeGreaterThan(0);

    for (const label of ["Move left", "Move right", "Jump"]) {
      await expect(game.getByRole("button", { name: label })).toBeVisible();
    }
    await expect(game.getByText(/0\/\d+ frames/)).toBeVisible();
  });

  test("a level can be played through its boss and reveals the real achievements", async ({
    page,
  }) => {
    test.setTimeout(180_000);

    await page.goto("/");
    await waitForHydration(page);
    await page.getByRole("button", { name: /play my career/i }).click();
    const game = page.getByRole("dialog", { name: "Career mode" });

    await game.getByRole("button", { name: /CAE/ }).first().click();
    await game.getByRole("button", { name: "Start level" }).click();
    await expect(game.locator("canvas")).toBeVisible();

    const cleared = game.getByText(/level cleared/i);
    const bossBanner = game.getByText("BOSS", { exact: true });

    // Run right, jumping on a rhythm, until the boss wakes up.
    await page.keyboard.down("ArrowRight");
    const runDeadline = Date.now() + 60_000;
    while (Date.now() < runDeadline) {
      if ((await bossBanner.count()) || (await cleared.count())) break;
      await page.keyboard.down("Space");
      await page.waitForTimeout(130);
      await page.keyboard.up("Space");
      await page.waitForTimeout(320);
    }
    await page.keyboard.up("ArrowRight");
    await expect(bossBanner).toBeVisible();

    // Stomping is the only way through: jump first, then drift forward so the
    // descent lands on top of it rather than walking into its side.
    const fightDeadline = Date.now() + 90_000;
    while (Date.now() < fightDeadline) {
      if (await cleared.count()) break;
      await page.keyboard.down("Space");
      await page.waitForTimeout(120);
      await page.keyboard.up("Space");
      await page.keyboard.down("ArrowRight");
      await page.waitForTimeout(260);
      await page.keyboard.up("ArrowRight");
      await page.waitForTimeout(420);
      await page.keyboard.down("ArrowLeft");
      await page.waitForTimeout(180);
      await page.keyboard.up("ArrowLeft");
      await page.waitForTimeout(120);
    }

    await expect(cleared).toBeVisible();
    await expect(game.getByText("30% fidelity gain")).toBeVisible();
  });

  test("career progress persists across a reload", async ({ page }) => {
    await page.goto("/");
    await waitForHydration(page);
    await page.evaluate(() =>
      localStorage.setItem("career-progress", JSON.stringify(["archer", "bell"])),
    );
    await page.reload();
    await waitForHydration(page);

    await expect(page.getByRole("button", { name: /play my career/i })).toContainText("2/4");
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
