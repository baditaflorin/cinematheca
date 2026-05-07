import { expect, test } from "@playwright/test";

test("loads the workbench and generates a festival package", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /Independent post house/i })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /Star repo/i })).toHaveAttribute(
    "href",
    "https://github.com/baditaflorin/cinematheca"
  );
  await expect(page.getByRole("link", { name: "PayPal", exact: true })).toHaveAttribute(
    "href",
    "https://www.paypal.com/paypalme/florinbadita"
  );
  await expect(page.getByText(/Version 0\.1\.0/i)).toBeVisible();

  await page.getByTestId("transcript").fill("A scene begins. The audience waits.");
  await page.getByTestId("generate-package").click();

  const download = page.getByTestId("download-package");
  await expect(download).toBeVisible();
  await expect(download).toHaveAttribute("download", /festival-package\.zip$/);
});
