# WCLoadTest

Customized version of Google's Chromium power_LoadTest app/extension ([code](https://chromium.googlesource.com/chromiumos/third_party/autotest/+/HEAD/client/site_tests/power_LoadTest), [homepage](http://www.chromium.org/chromium-os/testing/power-testing)) that runs for a set number of hours (default: 20) instead of just one.

To change number of loops (hours of testing), change value of "loop_hours" at the top of test.js
Log into Facebook and Gmail before starting test. 
Enable plug-ins automatically if you have them disabled (for streaming audio)

Re-synced to Google's own testing code 2019-02-19.

### How to install

1. Clone the repository or [download the ZIP file](archive/refs/heads/main.zip) and un-zip it anywhere on your device.
2. Go to `chrome://extensions/` and enable the Developer Mode checkbox.
3. Click the "Load unpacked" button and select the "extension" folder.