document.getElementById("saveButton").addEventListener("click", function () {
  const keyword = document.getElementById("keywordInput").value;

  chrome.storage.sync.set({ keyword: keyword }, function () {
    alert("Keyword saved!");
  });
});
