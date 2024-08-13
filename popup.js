document.getElementById("searchButton").addEventListener("click", function () {
  const input = document.getElementById("searchInput").value;

  chrome.storage.sync.get("keyword", function (data) {
    const keyword = data.keyword || "";
    const query = `${keyword} ${input}`;
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    chrome.tabs.create({ url: url });
  });
});
