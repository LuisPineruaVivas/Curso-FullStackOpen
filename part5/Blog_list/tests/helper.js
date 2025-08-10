import { expect } from "@playwright/test"

const loginWith = async (page, username, password)  => {
  await page.getByTestId('username').fill(username)
  await page.getByTestId('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}
 const createBlog = async (page, title, author, url, likes = 0) => {
  await page.getByRole('button', { name: 'Create new blog' }).click()
  await page.getByPlaceholder('Title').fill(title)
  await page.getByPlaceholder('Author').fill(author)
  await page.getByPlaceholder('Url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

const editBlog = async (page) => {
  await page.getByRole('button', { name: 'View Details' }).click()
  const likes = await page.getByTestId('likes')
  const likeNumber =  await likes.innerText()
  await page.getByRole('button', { name: 'like' }).click()

  await expect(likes).toContainText((parseInt(likeNumber) + 1).toString())
}

const deleteBlog = async (page, title) => {
  page.on('dialog', async dialog => {
    await dialog.accept();
  });
  await page.getByRole('button', { name: 'View Details' }).click()
  await page.getByRole('button', { name: 'Remove' }).click()
}


export { loginWith, createBlog, editBlog, deleteBlog}