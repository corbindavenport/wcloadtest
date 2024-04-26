// Open test window in popup when action button is clicked
chrome.action.onClicked.addListener(function() {
  chrome.windows.create({
    url: 'bg.html',
    type: 'popup',
    width: 500,
    height: 400,
    left: 100,
    top: 100,
    focused: true
  });
});