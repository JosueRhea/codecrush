import { test, expect } from "@playwright/test";

test("@codecrush-core", async ({ page }) => {
  await page.goto("http://localhost:5173/");

  // check if the editor is loaded
  const editorContainer = await page.getByTestId("codecrush-container");
  await expect(editorContainer).toHaveAttribute("editor-loaded", "true");

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

  // TODO: check the cursor
});
