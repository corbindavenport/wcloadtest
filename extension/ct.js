// Copyright (c) 2010 The Chromium OS Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

request = { action: 'should_scroll' }

chrome.runtime.onMessage.addListener(
  function (message, sender, callback) {
    if (message == "numberOfVideosPlaying") {
      callback(numberOfVideosPlaying());
    }
  });

function numberOfVideosPlaying() {
  let number_of_videos_playing = 0;
  for (let video of document.querySelectorAll('video')) {
    if (!video.paused) {
      number_of_videos_playing++;
    }
  }

  return number_of_videos_playing;
}

// Sends message to the test.js(background script). test.js onreceiving a message from content script assumes the page has loaded successfully. It further responds with instructions on whether/how to scroll.
function sendSuccessToBGScript() {
  chrome.runtime.sendMessage(request, function (response) {
    if (response && response.should_scroll) {
      window.focus();
      lastOffset = window.scrollY;
      var start_interval = Math.max(1000, response.scroll_interval);
      function smoothScrollDown() {
        window.scrollBy(0, response.scroll_by);
        if (window.scrollY != lastOffset) {
          lastOffset = window.scrollY;
          setTimeout(smoothScrollDown, response.scroll_interval);
        } else if (response.should_scroll_up) {
          setTimeout(smoothScrollUp, start_interval);
        }
      }
      function smoothScrollUp() {
        window.scrollBy(0, -1 * response.scroll_by);
        if (window.scrollY != lastOffset) {
          lastOffset = window.scrollY;
          setTimeout(smoothScrollUp, response.scroll_interval);
        } else if (response.scroll_loop) {
          setTimeout(smoothScrollDown, start_interval);
        }
      }
      setTimeout(smoothScrollDown, start_interval);
    }
  });
}

window.addEventListener('load', function() {
  sendSuccessToBGScript();
});
