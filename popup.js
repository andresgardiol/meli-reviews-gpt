document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.sync.get("openaiToken", function (data) {
    const tokenElement = document.getElementById("token");
    if (data.openaiToken) {
      tokenElement.innerText = data.openaiToken;
    } else {
      tokenElement.innerText = "No token set";
    }
  });

  const optionsButton = document.getElementById("options");
  optionsButton.addEventListener("click", function () {
    chrome.runtime.openOptionsPage();
  });
});
