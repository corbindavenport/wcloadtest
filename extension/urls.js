// Copyright 2010 The ChromiumOS Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
// List of tasks to accomplish
var ViewGDoc = ('https://docs.google.com/document/d/');
var RADIO_AUDIO_URL = 'https://storage.googleapis.com/chromiumos-test-assets-public/power_LoadTest/long_rain.mp3'
var PLAY_MUSIC_URL = 'https://play.google.com/music/listen?u=0#/wst/st/a2be2d85-0ac9-3a7a-b038-e221bb63ef71';
// List of popular websites
var URLS = [
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
    urls: URLS,
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
    type: 'window',
    name: 'video',
    start: minutes(54),
    duration: minutes(6),
    focus: true,
    tabs: [
      'https://www.youtube.com/embed/YE7VzlLtp-4?start=236&vq=hd720&autoplay=1'
    ]
  },
]