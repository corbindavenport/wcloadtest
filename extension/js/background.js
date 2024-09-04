// Open test window in popup when action button is clicked
chrome.action.onClicked.addListener(function() {
  chrome.windows.create({
    url: 'test.html',
    type: 'popup',
    width: 550,
    height: 620,
    left: 100,
    top: 100,
    focused: true
  });
});