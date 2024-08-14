# WCLoadTest

WCLoadTest is a browser extension to simulate typical browsing behavior for testing laptop battery life, based on Google's [Chromium power_LoadTest tool](http://www.chromium.org/chromium-os/testing/power-testing). It uses the [Bootstrap](https://getbootstrap.com/) framework.

### How to install

1. Clone the repository or [download the ZIP file](https://github.com/corbindavenport/wcloadtest/archive/refs/heads/main.zip) and un-zip it anywhere on your device.
2. Go to `chrome://extensions/` and enable the Developer Mode checkbox.
3. Click the "Load unpacked" button and select the "extension" folder.

### How to run

Click the extension's toolbar button to open the test window, then click the button to start. The test will continue until the window is closed or the loop is completed.

When running on a Windows machine, make sure "Automatically save my restartable apps and restart them when I sign back in" is turned off in the Windows settings, and [turn off hibernation](https://learn.microsoft.com/en-us/troubleshoot/windows-client/setup-upgrade-and-drivers/disable-and-re-enable-hibernation).

Memory Saver should be turned off in your browser, or the window with the test could be put to sleep and stop the test. You can click the 'Open Memory saver settings' link in the test window to jump to the settings. You should also log into Facebook and Gmail before running the test.
