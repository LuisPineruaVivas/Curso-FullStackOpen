const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, editBlog, deleteBlog } = require('./helper')
const blog = require('../Backend/models/blog')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
            data: {
                name: 'Luis Ale',
                username: 'Luis',
                password: '12345',
            }
        })
    await request.post('/api/users', {
            data: {
                name: 'Second User',
                username: 'Mlukkai',
                password: '12345',
            }
        })
    await page.goto('/')
    })

    test('Login form is shown', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
        await expect(page.getByTestId('username')).toBeVisible()
        await expect(page.getByTestId('password')).toBeVisible()
    })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        await loginWith(page, 'Luis', '12345')
        await expect(page.getByText('Logged in as Luis Ale')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await loginWith(page, 'Luis', 'wrong')
        const errorDiv = await page.locator('.error')
        await expect(errorDiv).toContainText('Wrong credentials')
        await expect(errorDiv).toHaveCSS('border-style', 'solid')
        await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

        await expect(page.getByText('Luis Ale logged in')).not.toBeVisible()
    })
  })

  describe('when logged in', () => {
        beforeEach(async ({ page, request }) => {
            await loginWith(page, 'Luis', '12345')
        })

        test('a new blog can be created', async ({ page }) => {
            await createBlog(page, 'testing title', 'testing author', 'testing url')
            await expect(page.getByText('Title: testing title')).toBeVisible()
        })

        test('a blog can be edited', async ({ page }) => {
            await createBlog(page, 'testing title', 'testing author', 'testing url')
            await editBlog(page)
        })

        test('a blog can be deleted', async ({ page }) => {
            await createBlog(page, 'testing title', 'testing author', 'testing url')
            await expect(page.getByText('Title: testing title')).toBeVisible()
            await deleteBlog(page, 'testing title')
            await expect(page.getByText('Title: testing title')).not.toBeVisible()
        })

        test('only the creator can see the delete button', async ({ page }) => {
            await createBlog(page, 'testing title', 'testing author', 'testing url')
            await page.getByRole('button', { name: 'Logout' }).click()
            await loginWith(page, 'Mlukkai', '12345')
            await page.getByRole('button', { name: 'View Details' }).click()
            await expect(page.getByRole('button', { name: 'Remove' })).not.toBeVisible()
        })

    }) 

    test('Blogs are order by likes', async ({ page, request }) => {
        //Upload some blogs
        const user = { username: 'Luis', password: '12345' }
        const loginRes = await request.post('/api/login', { data: user })
        const loginData = await loginRes.json()
        const token = loginData.token

        const blog1 = { title: 'Blog 1', author: 'Author 1', url: 'https://blog1.com', likes: 16 }
        const blog2 = { title: 'Blog 2', author: 'Author 2', url: 'https://blog2.com', likes: 32 }
        const blog3 = { title: 'Blog 3', author: 'Author 3', url: 'https://blog3.com', likes: 22 }
        const blog4 = { title: 'Blog 4', author: 'Author 4', url: 'https://blog4.com', likes: 8 }
        const blog5 = { title: 'Blog 5', author: 'Author 5', url: 'https://blog3.com', likes: 21 }

        for(const blog of [blog1, blog2, blog3, blog4, blog5]) {
            const res = await request.post('/api/blogs',{
                data: blog,
                headers: {
                    'Authorization': `Bearer ${token}`
                } 
            });
        }
        await loginWith(page, 'Luis', '12345')
        const detailBoxes = await page.getByRole('button', { name: 'View Details' }).all()
        let likes =[]

        //check likes of each blog
        for (let idx = 0; idx < detailBoxes.length; idx++) {
            await detailBoxes[idx].click();
            likes[idx] = await page.getByTestId('likes').innerText();
            await page.getByRole('button', { name: 'hide' }).click();
        }

        expect(likes).toEqual(likes.sort((a, b) => b - a))
    })
})