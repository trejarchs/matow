function getSearchReq() {
  let str = window.location.search.substring(3);
  return decodeURI(str);
}

const mainTitle = document.querySelector("#search-req");
mainTitle.textContent += '"' + getSearchReq() + '"';

resultsFound = true;
let pages = getAllPages();
let searchResults = [];
for (let i = 0; i < pages.length; i++) {
  if (pages[i].name.toLowerCase().includes(getSearchReq().toLowerCase())) {
    searchResults.push(pages[i]);
  }
}

if (searchResults.length == 0) resultsFound = false;

if (resultsFound) {
  for (let i = 0; i < searchResults.length; i++) {
    let li = document.createElement("li");
    let a = document.createElement("a");
    let span = document.createElement("span");
    if (isLesson(searchResults[i])) {
      a.href = "lesson.html?r=" + searchResults[i].path;
      span.textContent = "Lezione";
    } else {
      a.href = "chapter.html?r=" + searchResults[i].path;
      span.textContent = "Capitolo";
    }
    a.innerHTML = searchResults[i].name;
    li.appendChild(a);
    li.appendChild(span);
    document.getElementById("search-list").appendChild(li);
  }
} else {
  let li = document.createElement("li");
  li.textContent = "Nessun risultato trovato";
  document.getElementById("search-list").appendChild(li);
}

function getAllPages() {
  let pages = [];
  for (let i = 0; i < chapters.length; i++) {
    pages.push(chapters[i]);
    for (let j = 0; j < chapters[i].lessons.length; j++) {
      pages.push(chapters[i].lessons[j]);
    }
  }
  return pages;
}

function isLesson(page) {
  return !page.hasOwnProperty("lessons");
}
