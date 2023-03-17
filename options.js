document.addEventListener("DOMContentLoaded", function () {
  // Get the input field and save button
  var openAITokenInput = document.getElementById("token");
  var openAISaveButton = document.getElementById("save");

  chrome.storage.sync.get("openaiToken", function (data) {
    openAITokenInput.value = data.openaiToken;
  });

  // Add a click event listener to the save button
  openAISaveButton.addEventListener("click", function () {
    // Get the value of the input field
    var tokenValue = openAITokenInput.value;

    // Save the token in the extension's storage
    chrome.storage.sync.set({ openaiToken: tokenValue }, function () {
      alert("Open AI API token saved");
    });
  });

  // Get the input field and save button for text to speech token
    var textToSpeechTokenInput = document.getElementById("textToSpeechToken");
    var textToSpeechSaveButton = document.getElementById("saveTextToSpeech");

    chrome.storage.sync.get("textToSpeechToken", function (data) {
        textToSpeechTokenInput.value = data.textToSpeechToken;
    });

  // Add a click event listener to the save button
    textToSpeechSaveButton.addEventListener("click", function () {
    // Get the value of the input field
    var tokenValue = textToSpeechTokenInput.value;

    // Save the token in the extension's storage
    chrome.storage.sync.set({ textToSpeechToken: tokenValue }, function () {
      alert("Text to speech API token saved");
        });
    });

});
