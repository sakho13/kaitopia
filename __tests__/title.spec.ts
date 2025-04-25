import { test, expect } from "@playwright/test"

test.describe("トップページ関係テスト", () => {
  test("タイトルからログイン画面に移動できる", async ({ page }) => {
    await page.goto("http://localhost:3000/")
    await page.getByRole("link", { name: "無料で始める" }).click()
    await expect(page).toHaveURL("http://localhost:3000/public/login")
  })

  test("既存ユーザでログインできる", async ({ page }) => {
    await page.goto("http://localhost:3000/")
    await page.getByRole("link", { name: "無料で始める" }).click()
    await expect(page).toHaveURL("http://localhost:3000/public/login")

    await page.getByRole("textbox", { name: "メールアドレス" }).click()
    await page
      .getByRole("textbox", { name: "メールアドレス" })
      .fill("kaitopia-user+001@kaitopia.com")
    await page.getByRole("textbox", { name: "メールアドレス" }).press("Tab")
    await page.getByRole("textbox", { name: "パスワード" }).fill("password")
    await page.getByRole("button", { name: "ログイン", exact: true }).click()
    await expect(page).toHaveURL("http://localhost:3000/v1/user", {
      timeout: 3000,
    })
  })
})
