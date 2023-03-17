document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.sync.get("openaiToken", function (data) {
    const tokenElement = document.getElementById("token");
    if (data.openaiToken) {
      tokenElement.innerText = data.openaiToken;
    } else {
      tokenElement.innerText = "No token set";
    }
  });

  chrome.storage.sync.get("textToSpeechToken", function (data) {
    const textToSpeechTokenElement = document.getElementById("textToSpeechToken");
    if (data.textToSpeechToken) {
      textToSpeechTokenElement.innerText = data.textToSpeechToken;
    } else {
      textToSpeechTokenElement.innerText = "No token set";
    }
  });

  const optionsButton = document.getElementById("options");
  optionsButton.addEventListener("click", function () {
    chrome.runtime.openOptionsPage();
  });
});
