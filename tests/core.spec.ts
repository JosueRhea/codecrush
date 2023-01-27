import { test, expect } from "@playwright/test";

test("@codecrush-core", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // check if the editor is loaded
  const editorContainer = await page.getByTestId("codecrush-container");
  await expect(editorContainer).toHaveAttribute("editor-loaded", "true", {
    timeout: 10000,
  });

  // check focused class
  editorContainer.click();
  await expect(editorContainer).toHaveClass(
    "codecrush-editor codecrush-editor-focused"
  );

  // Check code and syntax hightlighting
  const firstLine = await editorContainer
    .getByRole("code")
    .locator(".line")
    .nth(0);
  await expect(firstLine).toHaveClass("line active");
  await page.keyboard.type('const hello = "Hello world!"', { delay: 50 });
  const lineContent = await firstLine.locator(".line-content");
  await expect(lineContent).toHaveText('const hello = "Hello world!"');
  await expect(lineContent.locator("span").nth(0)).toHaveText("const");
  await expect(lineContent.locator("span").nth(0)).toHaveAttribute(
    "style",
    "color: rgb(145, 180, 213);"
  );

  await expect(lineContent.locator("span").nth(2)).toHaveText("hello");
  await expect(lineContent.locator("span").nth(2)).toHaveAttribute(
    "style",
    "color: rgb(228, 240, 251);"
  );

  // check create new line with content
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("Enter");

  const activeLine = editorContainer.locator(".line").nth(1);
  await expect(activeLine).toHaveText('rld!"');
  await expect(activeLine).toHaveClass("line active");

  // Line selection
  await page.keyboard.press("End");
  await page.keyboard.down("Shift");
  await page.keyboard.press("Home");
  await page.keyboard.up("Shift");
  await page.keyboard.press("Backspace");

  await expect(activeLine).toHaveText("");

  await page.keyboard.press("Backspace");
  await page.keyboard.down("Shift");
  await page.keyboard.press("Home");
  await page.keyboard.up("Shift");
  await page.keyboard.press("Backspace");

  //Autocompletion
  await page.keyboard.press("f");
  const autoCompletionEl = editorContainer.locator("pre > .autocompletion");
  const firstAutoCompletion = autoCompletionEl
    .locator(".autocompletion-result")
    .nth(0);
  await expect(firstAutoCompletion).toHaveClass("autocompletion-result active");
  await expect(
    await (
      await firstAutoCompletion.innerText()
    ).length
  ).toBeGreaterThan(0);

  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("ArrowDown");
  }

  const activeCompletion = autoCompletionEl.locator(".active");
  const autoCompletionText = await activeCompletion
    .locator("span")
    .nth(0)
    .textContent();
  await page.keyboard.press("Enter");
  const lineContentAfterAutoCompletion = await firstLine.textContent();

  await expect(lineContentAfterAutoCompletion).toBe(autoCompletionText);

  // TODO: check the cursor
});
