const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe("Create Post Page", function() {
    this.timeout(60000);
    let driver;
  
    before(async function() {
      driver = await new Builder().forBrowser('chrome').build();
    });
  
    after(async function() {
      await driver.quit();
    });

    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    // Helper function to log in
    async function login(username, password) {
        await driver.get('http://localhost:3000/login');
        const usernameInput = await driver.findElement(By.css('input.login_div7__ond80'));
        const passwordInput = await driver.findElement(By.css('input.login_div9__yOW_d'));
        const signInButton = await driver.findElement(By.css('.login_div14__bjpo5'));

        await usernameInput.sendKeys(username);
        await passwordInput.sendKeys(password);
        await signInButton.click();

        // Wait until the homepage loads
        await driver.wait(until.urlContains('/homepage'), 20000);
    }

    async function checkToastMessage(driver, cssSelector, expectedMessage) {
        const toastMessage = await driver.wait(
          until.elementLocated(By.css(cssSelector)),
          10000
        );
        const isDisplayed = await toastMessage.isDisplayed();
        const text = await toastMessage.getText();
        assert.strictEqual(isDisplayed && text === expectedMessage, true, `Toast message không hiển thị hoặc không chứa nội dung mong đợi. Message: ${text}`);
      }
    

    it('should create a new post', async function()  {
        await login('lientest', 'bichLien#20110335');
        await driver.get('http://localhost:3000/edit-post/667e5af0769934a526d56a00');

        // Điền tiêu đề
        const titleInput = await driver.wait(until.elementLocated(By.css('input[placeholder="Nhập tiêu đề..."]')), 5000);
        await titleInput.sendKeys('Test - Tiêu đề bài viết');

        // Chọn ảnh cho bài viết
        // const imageInput = await driver.findElement(By.css('input[type="file"]'));
        // await imageInput.sendKeys(`${process.cwd()}/test/test-newpost.png`);

        // Select tags
        const selectTagButton = await driver.findElement(By.css('.EditPost_tagInput__kMi7c .EditPost_btn__m0EBk'));
        await selectTagButton.click();
        await sleep(1000); // Đợi modal mở ra

        // Tìm và chọn một tag
        const dropdownButton = await driver.findElement(By.css('button[data-slot="trigger"]'));
        await dropdownButton.click();
        await sleep(1000); // Đợi dropdown mở ra
        
        // Tìm và click vào phần tử trong dropdown dựa trên text
        const dropdownItems = await driver.findElements(By.css('ul[data-slot="list"]'));
        for (const item of dropdownItems) {
            if ((await item.getText()).trim() === "Review sách") {
              await item.click();
            }
          }

        await dropdownButton.click();
        await sleep(500); // Đợi dropdown đóng lại

        const modalCloseButton = await driver.findElement(By.xpath("(//button[normalize-space()='Close'])[1]"));
        await modalCloseButton.click();
        await sleep(500);

        // Enter content in the rich text editor
        await sleep(3000);
        const richTextEditor = await driver.findElement(By.xpath("//div[@role='textbox']"));
        await richTextEditor.clear();
        await richTextEditor.sendKeys('NNội dung bài viết chỉnh sửa');

        // Submit the form
        const submitButton = await driver.findElement(By.css('.EditPost_submitBtn__t3NP6'));
        await submitButton.click();
        await sleep(2000);

        let message = await driver.wait(until.elementLocated(By.css('.go3958317564')), 10000).getText();
        while (message === 'Processing...') {
            await driver.sleep(1500);
            message = await driver.wait(until.elementLocated(By.css('.go3958317564')), 10000).getText();
        }
        await checkToastMessage(driver, '.go3958317564', 'Bài viết được cập nhật thành công!');
    });
});
