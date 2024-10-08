function validateURLPattern(value) {
  // `{query}` が含まれているかチェック
  if (!value.includes("{query}")) {
    return false;
  }

  // URL が `http://` または `https://` で始まっているかチェック
  if (!(value.startsWith("http://") || value.startsWith("https://"))) {
    return false;
  }

  return true;
}

document.addEventListener("DOMContentLoaded", function () {
  const keywordContainer = document.getElementById("keywordContainer");

  // 保存されたキーワードを取得して表示
  chrome.storage.sync.get("keywords", function (data) {
    const keywords = data.keywords || [];
    keywords.forEach(function (keywordData, index) {
      addKeywordInput(keywordData.keyword, keywordData.pattern, index);
    });
  });

  // 新しいキーワード入力フィールドを追加する関数
  function addKeywordInput(value = "", pattern = "url", index = Date.now()) {
    const div = document.createElement("div");
    div.className = "keyword-entry";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter keyword...";
    input.value = value;

    const removeButton = document.createElement("button");
    removeButton.className = "remove-button";
    removeButton.textContent = "✖";
    removeButton.addEventListener("click", function () {
      keywordContainer.removeChild(div);
    });

    const patternSelect = document.createElement("div");
    patternSelect.className = "pattern-select";
    patternSelect.innerHTML = `
      <label><input type="radio" name="pattern${index}" value="url" ${
      pattern === "url" ? "checked" : ""
    }> URLとして検索({query}を含む)</label>
      <label><input type="radio" name="pattern${index}" value="query" ${
      pattern === "query" ? "checked" : ""
    }> googleで検索prefix</label>
    `;

    div.appendChild(input);
    div.appendChild(removeButton);
    div.appendChild(patternSelect);
    keywordContainer.appendChild(div);
  }

  // 「追加する」ボタンを押したときに新しいテキストボックスを追加
  document.getElementById("addButton").addEventListener("click", function () {
    addKeywordInput();
  });

  // 「保存」ボタンを押したときにすべてのキーワードと検索パターンを保存
  document.getElementById("saveButton").addEventListener("click", function () {
    const keywordEntries = document.querySelectorAll(".keyword-entry");
    const keywordList = [];
    let valid_patterns_flag = true;

    keywordEntries.forEach((entry, index) => {
      const input = entry.querySelector("input[type='text']");
      const selectedPattern = entry.querySelector(
        `input[name='pattern${index}']:checked`
      )?.value;

      if (selectedPattern == "url") {
        if (!validateURLPattern(input.value)) {
          alert(`Pattern at index ${index} does not satisfy url placeholder.`);
          valid_patterns_flag = false;
          return;
        }
      }

      if (input.value.trim() !== "") {
        keywordList.push({
          keyword: input.value.trim(),
          pattern: selectedPattern || "query", // デフォルト値として "query" を指定
        });
      }
    });

    if (valid_patterns_flag) {
      chrome.storage.sync.set({ keywords: keywordList }, function () {
        alert("Settings saved!");
      });
    }
  });
});
