import { expect, Locator, Page } from "@playwright/test";

// Utility with convenience functions
export class PlaywrightHelper {

    
    /**
     * This function extracts the image source from a given image element locator
     */
    static async validateImage(locator: Locator, page: Page){
        await expect(locator).toBeVisible();
        const imgSrc = await locator.getAttribute('src');
        await PlaywrightHelper.validateImageSrc(imgSrc, page);
    }

    /**
     * This function extracts the image source from the 'background-image' attribute of a given locator
     */
    static async validateBackgroundImage(locator: Locator, page: Page){
        let backgroundImageUrl = await locator.evaluate((el) => {
            return window.getComputedStyle(el).getPropertyValue("background-image");
        });
        backgroundImageUrl = backgroundImageUrl.slice(4, -1);
        await PlaywrightHelper.validateImageSrc(backgroundImageUrl, page);
    }

    /**
    * This function uses the provided image source and sends a GET request to verify if the source is valid (HTTP-200)
    */
    static async validateImageSrc(imgSrc: string, page: Page){
        expect.soft(imgSrc?.length).toBeGreaterThan(1);
        const response = await page.request.get(process.env.BASEURL + imgSrc,
            {
            ignoreHTTPSErrors: true  //Ignore SSL Certificate Errors
            }
        );
        expect.soft(response.ok(), "Cannot load image.").toBeTruthy();
    }

    /**
     * When checking for text length to be greater 0, make sure it´s also visible
     */
    static async isVisibleAndHasText(locator: Locator): Promise<boolean> {
        const isVisible = await locator.isVisible();
        if (!isVisible) {
            return false;
        }

        const elementText = await locator.textContent();
        return elementText.trim().length > 0;
    }

    /**
    * When checking for specific text content, make sure it´s also visible    *
    */
    static async isVisibleWithText(locator: Locator, expectedText: string): Promise<boolean> {
        const isVisible = await locator.isVisible();
        if (!isVisible) {
            return false;
        }

        const elementText = await locator.textContent();
        return elementText.includes(expectedText);
    }

    /**
     * When checking for specific HTML content, make sure it´s also visible
     */
    static async isVisibleWithInnerHtml(locator: Locator, expectedHtml: string): Promise<boolean> {
        const isVisible = await locator.isVisible();
        if (!isVisible) {
            return false;
        }

        const elementText = await locator.innerHTML();
        return elementText.includes(expectedHtml);
    }

    /**
    * When an element is expected to visible and also enabled, like for button elements
    */
    static async isVisibleAndEnabled(locator: Locator): Promise<boolean> {
        const isVisible = await locator.isVisible();
        if (!isVisible) {
            return false;
        }
        return await locator.isEnabled();
    }

    /**
     * Checks if the specified element (visible but not in view) is within the viewport.
    */
    static async isElementInView(element: Locator, page: Page) {
        if (element) {
            // Get the bounding box of the element relative to the viewport
            const boundingBox = await element.boundingBox();

            if (boundingBox) {
                // Get viewport size
                const viewportSize = await page.viewportSize();
                const viewportWidth = viewportSize.width;
                const viewportHeight = viewportSize.height;

                // Check if the element is in the current viewport
                return boundingBox.x >= 0 &&
                    boundingBox.y >= 0 &&
                    boundingBox.x + boundingBox.width <= viewportWidth &&
                    boundingBox.y + boundingBox.height <= viewportHeight;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    static async swipeLeft(element, page: Page){
        const scroll = await element.boundingBox();
        await page.mouse.wheel(0, scroll.y-(page.viewportSize().height/2));
        await page.waitForTimeout(100);

        const box = await element.boundingBox();

        const x = box.x + (box.width*0.75);
        let y = box.y + (box.height/2);

        await page.waitForTimeout(1000);

        await page.mouse.move(x, y);

        await page.mouse.down();

        const steps_length = (box.width) / 10;
        let end = x;

        for(let i = 0; i < 12; i++){

            end = end - steps_length;
            await page.mouse.move(end, y);
            await page.waitForTimeout(50);

        }
        await page.waitForTimeout(300);
        await page.mouse.up();
    }

    static async swipeRight(element, page: Page){
        const scroll = await element.boundingBox();
        await page.mouse.wheel(0, scroll.y-(page.viewportSize().height/2));
        const box = await element.boundingBox();

        const x = box.x + (box.width/2);
        let y = box.y + (box.height/2);

        await page.waitForTimeout(1000);

        await page.mouse.move(x, y);
        await page.mouse.down();
        const steps_length = (box.width) / 10;
        let end = x;

        for(let i = 0; i < 12; i++){

            end = end + steps_length;
            await page.mouse.move(end, y);
            await page.waitForTimeout(50);

        }

        await page.waitForTimeout(300);
        await page.mouse.up();
    }

    /**
     * Validates button text before clicking the button
     */
    static async clickButtonWithText(button: Locator, buttonText: string){
        expect(await PlaywrightHelper.isVisibleAndEnabled(button)).toBeTruthy();
        await expect(button).toHaveText(buttonText);
        await button.click();
    }
}
