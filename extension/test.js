// Copyright (c) 2014 The Chromium OS Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Main variables
const ifEdge = navigator.userAgent.includes('Edg/');
var test_time_ms = minutes(60);
var test_startup_delay = seconds(5);
var should_scroll = true;
var should_scroll_up = true;
var scroll_loop = false;
var scroll_interval_ms = 10000;
var scroll_by_pixels = 600;
var cycle_tabs = {};
var cycles = {};
var time_ratio = 3600 * 1000 / test_time_ms; // default test time is 1 hour
var preexisting_windows = [];
var log_lines = [];
var error_codes = {}; //for each active tabId
var page_timestamps = [];
var page_timestamps_recorder = {};
var loop_hours = 30;
var keys_values = [];

// Convert seconds to milliseconds
function seconds(s) {
  return s * 1000;
}

// Convert minutes to milliseconds
function minutes(m) {
  return seconds(m * 60);
}

// Returns a formatted string of current time for debugging
function dateToString(date) {
  var formatting = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  }
  var timeString = date.toLocaleTimeString([], formatting);
  timeString = timeString + ":" + date.getMilliseconds();
  return timeString
}

// List of URLs for tasks
var ViewGDoc = ('https://docs.google.com/document/d/');
var RADIO_AUDIO_URL = 'https://storage.googleapis.com/chromiumos-test-assets-public/power_LoadTest/long_rain.mp3'

// List of popular websites for simulated web browsing
var sitesArray = [
  'https://www.google.com/search?q=google',
  'https://www.youtube.com',
  'https://www.facebook.com/facebook',
  'https://www.amazon.com',
  'https://www.wikipedia.org/wiki/Google',
  'https://www.reddit.com',
  'https://www.yahoo.com',
  'https://www.twitter.com/google',
  'https://www.linkedin.com/jobs/management-jobs',
  'https://www.instagram.com/instagram',
  'https://www.ebay.com',
  'https://www.netflix.com',
  'https://www.twitch.tv',
  'https://www.espn.com',
  'https://www.instructure.com',
  'https://www.live.com',
  'https://www.craigslist.org',
  'https://www.imgur.com',
  'https://www.chase.com',
  'https://www.paypal.com',
  'https://www.bing.com/search?q=google',
  'https://www.cnn.com',
  'https://www.fandom.com',
  'https://www.imdb.com',
  'https://www.pinterest.com',
  'https://www.office.com',
  'https://www.nytimes.com',
  'https://www.github.com/explore',
  'https://www.hulu.com',
  'https://www.zillow.com',
  'https://www.microsoft.com',
  'https://www.apple.com',
  'https://www.intuit.com',
  'https://www.salesforce.com',
  'https://www.stackoverflow.com',
  'https://www.yelp.com',
  'https://www.walmart.com',
  'https://www.bankofamerica.com',
  'https://www.tumblr.com/explore',
  'https://www.dropbox.com',
  'https://www.wellsfargo.com',
  'https://www.quora.com',
  'https://www.quizlet.com',
  'https://www.weather.com',
  'https://www.accuweather.com',
  'https://www.foxnews.com',
  'https://www.msn.com',
  'https://www.indeed.com/l-Mountain-View-jobs.html',
  'https://duckduckgo.com/?q=google',
  'https://www.accuweather.com'
];

var tasks = [
  {
    // Chrome browser window 1. This window remains open for the entire test.
    type: 'window',
    name: 'background',
    start: 0,
    duration: minutes(60),
    focus: false,
    tabs: [
      'https://www.google.com/search?q=google',
      'https://news.google.com',
      'https://www.reddit.com',
      'https://www.amazon.com',
      'https://www.instagram.com/instagram'
    ]
  },
  {
    // Page cycle through popular external websites for 36 minutes
    type: 'cycle',
    name: 'web',
    start: seconds(1),
    duration: minutes(36),
    delay: seconds(60), // A minute on each page
    timeout: seconds(30),
    focus: true,
    urls: sitesArray,
  },
  {
    // After 36 minutes, actively read e-mail for 12 minutes
    type: 'cycle',
    name: 'email',
    start: minutes(36) + seconds(1),
    duration: minutes(12) - seconds(1),
    delay: minutes(5), // 5 minutes between full gmail refresh
    timeout: seconds(30),
    focus: true,
    urls: [
      'https://gmail.com',
      'https://mail.google.com'
    ],
  },
  {
    // After 36 minutes, start streaming audio (background tab), total playtime
    // 12 minutes
    type: 'cycle',
    name: 'audio',
    start: minutes(36),
    duration: minutes(12),
    delay: minutes(12),
    timeout: seconds(30),
    focus: false,
    urls: [RADIO_AUDIO_URL, RADIO_AUDIO_URL],
  },
  {
    // After 48 minutes, play with Google Docs for 6 minutes
    type: 'cycle',
    name: 'docs',
    start: minutes(48),
    duration: minutes(6),
    delay: minutes(1), // A minute on each page
    timeout: seconds(30),
    focus: true,
    urls: [
      ViewGDoc + '1ywpQGu18T9e2lB_QVMlihDqiF0V5hsYkhlXCfu9B8jY',
      ViewGDoc + '12qBD7L6n9hLW1OFgLgpurx7WSgDM3l01dU6YYU-xdXU'
    ],
  },
  {
    // After 54 minutes, watch Big Buck Bunny for 6 minutes
    // The video is muted because otherwise the autoplay is usually blocked by the browser
    type: 'window',
    name: 'video',
    start: minutes(54),
    duration: minutes(6),
    focus: true,
    tabs: [
      'https://www.youtube.com/embed/YE7VzlLtp-4?start=236&vq=hd720&autoplay=1&mute=1'
    ]
  },
]

// Set up test
function setupTest() {
  // These listeners track request failure codes
  chrome.webRequest.onCompleted.addListener(capture_completed_status,
    { urls: ["<all_urls>"] });
  chrome.windows.getAll({
    populate: true
  }, function (windows) {
    preexisting_windows = windows;
    for (var i = 0; i < tasks.length; i++) {
      setTimeout(launch_task, tasks[i].start / time_ratio, tasks[i]);
    }
    var end = 3600 * 1000 / time_ratio;
    log_lines = [];
    page_timestamps = [];
    page_timestamps_recorder = {};
    keys_values = [];
    record_log_entry(dateToString(new Date()) + " Loop started");
    setTimeout(function () {
      console.log('Loop ended.')
    }, end);
  });
}

function close_preexisting_windows() {
  preexisting_windows.forEach(function (window) {
    // Don't close the popup window running this script
    if (window.type != 'popup') {
      chrome.windows.remove(window.id);
    }
  })
  preexisting_windows.length = 0;
}

// This function closes tabs except for the first tab if there are more than 1
// tab on the window. If there are no window, `chrome.windows.create()`
// restores the tabs from the previous session. Currently this behaviour is
// not observed on Ash due to a bug b/269545815.
function close_restored_tabs(win, callback) {
  chrome.tabs.query({ windowId: win.id }, (tabs) => {
    if (chrome.runtime.lastError) {
      console.error(
        "close_restored_tabs: chrome.tabs.query resulted in an error: "
        + chrome.runtime.lastError);
      // If there is an error, return without calling the callback.
      return;
    }

    if (tabs.length < 2) {
      callback();
      return;
    }

    let tabIds = [];
    for (let i = 1; i < tabs.length; i++) {
      tabIds.push(tabs[i].id);
    }

    // Note that the one tab that will remain after other tabs are removed will
    // be navigated to a url specified by the task so it does not matter what
    // tab remains. The only important thing here is that there is only one
    // tab on the window.
    chrome.tabs.remove(tabIds, () => {
      if (chrome.runtime.lastError) {
        console.error(
          "close_restored_tabs: chrome.tabs.remove resulted in an error: "
          + chrome.runtime.lastError);
        return;
      }

      callback();
    });
  })
}

function get_active_url(cycle) {
  active_idx = cycle.idx == 0 ? cycle.urls.length - 1 : cycle.idx - 1;
  return cycle.urls[active_idx];
}

function testListener(request, sender, sendResponse) {
  page = page_timestamps_recorder[sender.tab.id];
  console.log(JSON.stringify(page_timestamps_recorder));
  if (sender.tab.id in cycle_tabs) {
    cycle = cycle_tabs[sender.tab.id];
    cycle.successful_loads++;
    url = get_active_url(cycle);
    record_log_entry(dateToString(new Date()) + " [load success] " + url);
    if (request.action == "should_scroll" && cycle.focus) {
      sendResponse({
        "should_scroll": should_scroll,
        "should_scroll_up": should_scroll_up,
        "scroll_loop": scroll_loop,
        "scroll_interval": scroll_interval_ms,
        "scroll_by": scroll_by_pixels
      });
    }
    delete cycle_tabs[sender.tab.id];
  }
}

function capture_completed_status(details) {
  var tabId = details.tabId;
  if (!(details.tabId in error_codes)) {
    error_codes[tabId] = [];
  }
  var report = {
    'url': details.url,
    'code': details.statusCode,
    'status': details.statusLine,
    'time': new Date(details.timeStamp)
  }
  error_codes[tabId].push(report);
}


function cycle_navigate(cycle) {
  cycle_tabs[cycle.id] = cycle;
  var url = cycle.urls[cycle.idx];
  // Resetting the error codes.
  // TODO(coconutruben) Verify if resetting here might give us
  // garbage data since some requests/responses might still come
  // in before we update the tab, but we'll register them as
  // information about the subsequent url
  error_codes[cycle.id] = [];
  record_log_entry(dateToString(new Date()) + " [load start] " + url)
  var start = Date.now();
  // start_time of next page is end_browse_time of previous page
  if (cycle.id in page_timestamps_recorder) {
    page = page_timestamps_recorder[cycle.id];
    page['end_browse_time'] = start;
    page_timestamps.push(page);
    console.log(JSON.stringify(page_timestamps));
  }
  page_timestamps_new_record(cycle.id, url, start);
  chrome.tabs.update(cycle.id, { 'url': url, 'selected': true });
  cycle.idx = (cycle.idx + 1) % cycle.urls.length;
  if (cycle.timeout < cycle.delay / time_ratio && cycle.timeout > 0) {
    cycle.timer = setTimeout(cycle_check_timeout, cycle.timeout, cycle);
  } else {
    cycle.timer = setTimeout(cycle_navigate, cycle.delay / time_ratio, cycle);
  }
}

function record_error_codes(cycle) {
  var error_report = dateToString(new Date()) + " [load failure details] "
    + get_active_url(cycle) + "\n";
  var reports = error_codes[cycle.id];
  for (var i = 0; i < reports.length; i++) {
    report = reports[i];
    error_report = error_report + "\t\t" +
      dateToString(report.time) + " | " +
      "[response code] " + report.code + " | " +
      "[url] " + report.url + " | " +
      "[status line] " + report.status + "\n";
  }
  log_lines.push(error_report);
  console.log(error_report);
}

function cycle_check_timeout(cycle) {
  if (cycle.id in cycle_tabs) {
    cycle.failed_loads++;
    record_error_codes(cycle);
    record_log_entry(dateToString(new Date()) + " [load failure] " +
      get_active_url(cycle));
    cycle_navigate(cycle);
  } else {
    cycle.timer = setTimeout(cycle_navigate,
      cycle.delay / time_ratio - cycle.timeout,
      cycle);
  }
}

function launch_task(task) {
  if (task.type == 'window' && task.tabs) {
    chrome.windows.create(
      { 'url': '/focus.html', state: 'maximized' }, function (win) {
        close_preexisting_windows();

        close_restored_tabs(win, function () {
          chrome.windows.create({ url: '/focus.html', state: 'maximized' }, (win) => {
            // Create additional tabs as needed
            for (let i = 1; i < task.tabs.length; i++) {
              chrome.tabs.create({ windowId: win.id, url: '/focus.html' });
            }
            chrome.tabs.query({ windowId: win.id }, (tabs) => {
              tabs.forEach((tab, index) => {
                let url = task.tabs[index];
                let start = Date.now();
                page_timestamps_new_record(tab.id, url, start);
                chrome.tabs.update(tab.id, { url: url, highlighted: true });
              });
              console.log(JSON.stringify(page_timestamps_recorder));
            });
            setTimeout(function () {
              chrome.windows.remove(win.id);
            }, (task.duration / time_ratio));
          });
        });
      });
  } else if (task.type == 'cycle' && task.urls) {
    chrome.windows.create(
      { 'url': '/focus.html', state: 'maximized' }, function (win) {
        close_preexisting_windows();
        close_restored_tabs(win, function () {
          chrome.tabs.query({ windowId: win.id }, function (tabs) {
            var tab = tabs[0];
            var cycle = {
              'timeout': task.timeout,
              'name': task.name,
              'delay': task.delay,
              'urls': task.urls,
              'id': tab.id,
              'idx': 0,
              'timer': null,
              'focus': !!task.focus,
              'successful_loads': 0,
              'failed_loads': 0
            };
            cycles[task.name] = cycle;
            cycle_navigate(cycle);
            setTimeout(function (cycle, win_id) {
              clearTimeout(cycle.timer);
              chrome.windows.remove(win_id);
            }, task.duration / time_ratio, cycle, win.id);
          });
        });
      });
  }
}

function page_timestamps_new_record(tab_id, url, start) {
  // Sanitize url, make http(s)://www.abc.com/d/e/f into www.abc.com
  var tempUrl = new URL(url);
  cleanUrl = tempUrl.hostname;
  // Log
  page_timestamps_recorder[tab_id] = {
    'url': cleanUrl,
    'start_time': start,
    'end_load_time': null,
    'end_browse_time': null
  }
}

function record_log_entry(entry) {
  log_lines.push(entry);
}

function record_key_values(dictionary) {
  keys_values.push(dictionary);
}

function send_status() {
  var post = ["status=good"];

  for (var name in cycles) {
    var cycle = cycles[name];
    post.push(name + "_successful_loads=" + cycle.successful_loads);
    post.push(name + "_failed_loads=" + cycle.failed_loads);
  }
  chrome.runtime.onMessage.removeListener(testListener);
}

function startTest() {
  time_ratio = 3600 * 1000 / test_time_ms; // default test time is 1 hour
  chrome.runtime.onMessage.addListener(testListener);
  setTimeout(setupTest, 1000);
}

function initialize() {
  // Set status in UI
  const testBtn = document.getElementById('start-test-btn');
  testBtn.innerText = 'Test running...';
  testBtn.setAttribute('disabled', 'disabled');
  // Prevent accidental window close
  window.onbeforeunload = function () {
    // Warn before navigating away if there are any files imported
    return 'Are you sure you want to navigate away?'
  }
  // Request the screen not turn off
  chrome.power.requestKeepAwake('display');
  // Start the test with default settings
  chrome.runtime.onMessage.addListener(testListener);
  for (var i = 0; i < loop_hours; i++) {
    setTimeout(setupTest, 1000 + (i * 3600000));
  }
}


document.getElementById('start-test-btn').addEventListener('click', function () {
  initialize();
})

// Open Memory Saver page in browser
document.getElementById('open-memory-settings-link').addEventListener('click', function () {
  var memUrl = '';
  if (ifEdge) {
    memUrl = 'edge://settings/system#:~:text=Save%20resources%20with%20sleeping%20tabs';
  } else {
    memUrl = 'chrome://settings/performance#:~:text=Memory%20Saver';
  }
  chrome.tabs.create({
    'url': memUrl
  })
})