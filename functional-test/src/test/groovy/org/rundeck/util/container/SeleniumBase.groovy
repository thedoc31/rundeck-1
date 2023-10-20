package org.rundeck.util.container

import groovy.transform.CompileStatic
import org.openqa.selenium.WebDriver
import org.openqa.selenium.chrome.ChromeDriver

/**
 * Utility Base for selenium test specs
 */
@CompileStatic
class SeleniumBase extends BaseContainer implements WebDriver, SeleniumContext {
    /**
     * Create a driver
     */
    private WebDriver _driver

    @Delegate
    WebDriver getDriver() {
        if (null == _driver) {
            _driver = new ChromeDriver()
        }
        return _driver
    }


    def cleanup() {
        driver?.quit()
    }

    /**
     * Get a page object for the type
     * @param clazz Page object type, must have a constructor that takes a WebDriver
     * @return
     */
    <T> T page(Class<T> clazz) {
        return clazz.getDeclaredConstructor(SeleniumContext).newInstance(this)
    }
}
