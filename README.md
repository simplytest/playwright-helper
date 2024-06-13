# PlaywrightHelper

## PlaywrightHelper
Utility with convenience functions
### PlaywrightHelper.validateImageSrc()
Just checking if an image is visible will overlook broken image sources. 
This function extracts the document source and sends a get request to verify if the source is ok (HTTP-200).

Example:
```
const ImageElement = parentElement.getByRole("img");
await PlaywrightHelper.validateImageSrc(ImageElement);
```

### PlaywrightHelper.isVisibleWithText()
When checking for specific text content, make sure it´s also visible.

Example:
```
const element = fixture.page.locator(data.elementLocator);

// Use this
expect(PlaywrightHelper.isVisibleWithText(element, "expectedText")).toBeTruthy();

// Instead of this
expect(element).toBeVisible();
expect(element).toContainText("expectedText");
```

### PlaywrightHelper.isVisibleAndHasText()
When checking for text length to be greater 0, make sure it´s also visible.

Example:
```
const element = fixture.page.locator(data.elementLocator);

// Use this
expect(PlaywrightHelper.isVisibleAndHasText(element )).toBeTruthy();

// Instead of this
expect(element).toBeVisible();
await expect("expectedText").toBeGreaterThan(0);
```

### PlaywrightHelper.isVisibleAndEnabled()
When an element is expected to visible and also enabled, like for button elements.

Example :
```
const element = fixture.page.locator(data.elementLocator);

// Use this
expect(PlaywrightHelper.isVisibleAndEnabled(element)).toBeTruthy();

// Instead of this
expect(element).toBeVisible();
expect(element).toEnabled();
```

### PlaywrightHelper.isElementInView()
Checks if the specified element (visible but not in view) is within the viewport.

Example :
```
expect(PlaywrightHelper.isElementInView(element)).toBeTruthy();

```

### PlaywrightHelper.scrollToElement()
Scrolls the page until the specified element is in the viewport.

Example :
```
PlaywrightHelper.scrollToElement(element));

```
