document.addEventListener("DOMContentLoaded", function () {
  const keywordSelect = document.getElementById("keywordSelect");

  // 保存されたキーワードとパターンを取得してドロップダウンメニューに追加
  chrome.storage.sync.get("keywords", function (data) {
    const keywords = data.keywords || [];

    // キーワードが保存されていない場合、ドロップダウンを隠す
    if (keywords.length === 0) {
      keywordSelect.style.display = "none";
    } else {
      keywords.forEach(function (keywordData) {
        const option = document.createElement("option");
        option.value = keywordData.keyword;
        option.textContent = keywordData.keyword;
        option.dataset.pattern = keywordData.pattern; // パターンをデータ属性として追加
        keywordSelect.appendChild(option);
      });
    }
  });

  // 検索ボタンがクリックされたときに選択されたキーワードで検索
  document
    .getElementById("searchButton")
    .addEventListener("click", function () {
      const input = document.getElementById("searchInput").value;
      const selectedOption = keywordSelect.options[keywordSelect.selectedIndex];
      const selectedKeyword = selectedOption.value;
      const selectedPattern = selectedOption.dataset.pattern; // 選択されたキーワードのパターンを取得

      let url;

      if (selectedPattern === "url") {
        // URLとして検索
        url = `${selectedKeyword}${input}`;
      } else if (selectedPattern === "query") {
        // Search Engineでクエリとして利用
        const query = `${selectedKeyword} ${input}`;
        url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      }

      if (url) {
        chrome.tabs.create({ url: url });
      }
    });

  // オプションページへのリンクがクリックされたときにオプションページを開く
  optionsLink.addEventListener("click", function () {
    chrome.runtime.openOptionsPage();
  });
});
