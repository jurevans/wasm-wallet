// See: https://developer.chrome.com/docs/extensions/mv2/background_pages/.

chrome.runtime.onInstalled.addListener(() => {
  console.log('background listener: Extension installed successfully!');
});

export default {};
