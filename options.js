// Get the input field and save button
var tokenInput = document.getElementById("token");
var saveButton = document.getElementById("save");

// Add a click event listener to the save button
saveButton.addEventListener("click", function () {
  // Get the value of the input field
  var tokenValue = tokenInput.value;

  // Save the token in the extension's storage
  chrome.storage.sync.set({ openaiToken: tokenValue }, function () {
    alert("Open AI API token saved");
  });
});
