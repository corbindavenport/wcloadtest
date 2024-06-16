// Open test window in popup when action button is clicked
chrome.action.onClicked.addListener(function() {
  chrome.windows.create({
    url: 'test.html',
    type: 'popup',
    width: 650,
    height: 550,
    left: 100,
    top: 100,
    focused: true
  });
});