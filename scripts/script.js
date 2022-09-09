/*============
 * ELEMENTI
 =============*/
const sidebar = document.getElementById("sidebar");
const sideRect = document.getElementById("sidebar-rect");
const sideBtns = document.getElementsByClassName("side-btn");
const lessonPage = document.getElementById("lesson-page");
const footer = document.getElementById("footer");
const zero = document.querySelectorAll("zero-md")[0];
const sidebarNav = document.getElementById("sidebar-nav");
const sidebarChapter = document.getElementById("sidebar-chapter");
const chapterPlaceholder = document.getElementById("chapter-placeholder");

/*============
 * FUNZIONI
 =============*/
window.onscroll = function () {
  hideTopbar();
  closeMenu();
};

window.onload = function () {
  let x = window.matchMedia("(max-width: 870px)");
  adjustMain(x);
  x.addListener(adjustMain);

  if (isLesson(getCurrentPage())) {
    chapterPlaceholder.href = "chapter.html?r=" + getCurrentChapter().path;
    chapterPlaceholder.textContent = getCurrentChapter().name;
  } else {
    loadChapterContent();
  }
};

/* Funzione per aggiornare la posizione della sidebar
 * quando la topbar non è più visibile */
function hideTopbar() {
  if (window.scrollY > 90) {
    sidebar.style.top = "0px";
    sideBtns[0].style.top = "30px";
    sideBtns[1].style.top = "90px";
  } else {
    sidebar.style.top = "90px";
    sideBtns[0].style.top = "110px";
    sideBtns[1].style.top = "170px";
  }
}

/* Se la sidebar è attiva, chiude la Sidebar
 * altrimenti la apre */
function toggleSidebar() {
  mainTransition();
  isSidebarActive() ? closeSidebar() : openSidebar();
  updateMainPosition();
}

/* Funzione per far sì che il contenuto del main si sposti a destra/sinistra
 * a seconda dello stato della sidebar in maniera fluida.
 * Non potevo aggiungere direttamente la proprietà
 * "transition: margin-left .2s, margin-right .2s" al main-content perchè
 * tale proprietà avrebbe sovrascritto la proprietà "transition: none" che
 * mi permette di avere una animazione fluida di spostamento nel caso di
 * window resizing.
 * In questo modo riesco ad avere un'animazione fluida sia nel caso di window
 * resizing sia quando si apre/chiude la sidebar. */
function mainTransition() {
  lessonPage.style.transition = "0.2s";
  setTimeout(function () {
    lessonPage.style.transition = "0s";
  }, 200);
}

/* Funzione per controllare se la sidebar è attualmente attiva
 * oppure no,
 * returns true se è attiva, false altrimenti */
function isSidebarActive() {
  if (sidebar.style.width == "0px") return false;
  return true;
}

/* Funzione per aggiornare la posizione del main a seconda
 * dello stato della Sidebar */
function updateMainPosition() {
  if (isSidebarActive()) {
    lessonPage.style.marginLeft = "max(350px, 30vw)";
    lessonPage.style.marginRight = "max(100px, calc(30vw - 250px))";
  } else {
    lessonPage.style.marginLeft = "max(100px, 21.9vw)"; //21.9vw per preservare la larghezza originale del contenuto
    lessonPage.style.marginRight = "max(100px, 21.9vw)";
  }
}

/* Funzione per aprire la sidebar */
function openSidebar() {
  let sidebarElements = sidebar.querySelectorAll("*");
  for (let i = 0; i < sidebarElements.length; i++) {
    sidebarElements[i].style.display = "block";
  }
  sidebar.style.width = "250px";
  sideRect.style.width = "250px";
  sideBtns[0].style.left = "270px";
  sideBtns[1].style.left = "270px";
  footer.style.width = "calc(100% - 250px)";
}

/* Funzione per chiudere la sidebar */
function closeSidebar() {
  let sidebarElements = sidebar.querySelectorAll("*");
  for (let i = 0; i < sidebarElements.length; i++) {
    sidebarElements[i].style.display = "none";
  }
  sidebar.style.width = "0px";
  sideRect.style.width = "0px";
  sideBtns[0].style.left = "20px";
  sideBtns[1].style.left = "20px";
  footer.style.width = "100%";
}

/* Quando chiudo/apro la sidebar, le funzioni updateMainPosition() e
 * open/closeSidebar() sovrascrivono anche le proprietà all'interno del
 * @media query (in particolare i margini right/left di main-content
 * e la width del footer), quindi è necessario scrivere una funzione
 * che controlli sempre la dimensione della finestra e aggiusti queste
 * proprietà di conseguenza */
function adjustMain(x) {
  if (x.matches) {
    // Se lo schermo è più piccolo di 853px
    lessonPage.style.marginLeft = "20px";
    lessonPage.style.marginRight = "20px";
    footer.style.width = "100%";
  } else {
    updateMainPosition();
    isSidebarActive()
      ? (footer.style.width = "calc(100% - 250px)")
      : (footer.style.width = "100%");
  }
}

function getLessonReq() {
  let str = window.location.search.substring(3);
  return decodeURI(str);
}

//Funzioni per navigare tra le lezioni
function nextLesson() {
  let pages = getAllPages();
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].path == getLessonReq()) {
      if (i == pages.length - 1) window.location.href = "index.html";
      else if (isLesson(pages[i + 1])) {
        if (isLesson(pages[i])) {
          history.pushState(null, null, "lesson.html?r=" + pages[i + 1].path);
          zero.src = "lezioni/" + getLessonReq() + ".md";
        } else {
          window.location.href = "lesson.html?r=" + pages[i + 1].path;
        }
      } else {
        window.location.href = "chapter.html?r=" + pages[i + 1].path;
      }
      break;
    }
  }
}

function prevLesson() {
  let pages = getAllPages();
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].path == getLessonReq()) {
      if (i == 0) window.location.href = "index.html";
      else if (isLesson(pages[i - 1])) {
        if (isLesson(pages[i])) {
          history.pushState(null, null, "lesson.html?r=" + pages[i - 1].path);
          zero.src = "lezioni/" + getLessonReq() + ".md";
        } else {
          window.location.href = "lesson.html?r=" + pages[i - 1].path;
        }
      } else {
        window.location.href = "chapter.html?r=" + pages[i - 1].path;
      }
      break;
    }
  }
}

function updateSideBar() {
  //reset sidebar
  while (sidebarNav.lastChild) {
    if (sidebarNav.lastChild.tagName == "A") {
      sidebarNav.removeChild(sidebarNav.lastChild);
    } else break;
  }

  //aggiungo il link al capitolo
  let a = sidebarChapter.querySelectorAll("a")[0];
  a.href = "chapter.html?r=" + getCurrentChapter().path;
  a.textContent = getCurrentChapter().name;

  //aggiungo i link per la navigazione rapida
  let zero_sr = zero.shadowRoot;
  let headings = [...zero_sr.querySelectorAll("h1, h2, h3")];
  headings.forEach((heading) => {
    let a = document.createElement("a");
    a.textContent = heading.textContent;
    if (heading.tagName == "H3") {
      a.id = "sub-heading";
      a.textContent = " - " + a.textContent;
    }
    a.onclick = function () {
      heading.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };
    sidebarNav.appendChild(a);
  });
}

window.addEventListener("zero-md-rendered", () => {
  zero.src = "lezioni/" + getLessonReq() + ".md";
  updateSideBar();
  if (isDarkMode()) {
    darkSynstax()
} else {
    lightSynstax()
};
});

window.addEventListener("zero-md-error", (ev) => {
  if (ev.detail.status) {
    let lesson = document.getElementById("lesson");
    lesson.innerHTML = "<h1>Errore: " + ev.detail.status + "</h1>";
    lesson.innerHTML +=
      '<p>La pagina "' + getLessonReq() + '" non è stata trovata.</p>';
    lesson.style.color = 'var(--h12-color)'
    let navBtns = document.querySelectorAll(".nav-btn");
    navBtns.forEach((btn) => {
      btn.style.display = "none";
    });
  }
});

window.addEventListener("popstate", () => {
  zero.src = "lezioni/" + getLessonReq() + ".md";
});

function loadChapterContent() {
  for (let i = 0; i < chapters.length; i++) {
    let a = document.createElement("a");
    a.href = "chapter.html?r=" + chapters[i].path;
    a.textContent = chapters[i].name;
    sidebarNav.appendChild(a);
  }

  const chapterName = document.getElementById("chapter-name");
  chapterName.textContent = getCurrentChapter().name;

  const lessonList = document.getElementById("lesson-list");
  for (let i = 0; i < getLessonsOf(getCurrentChapter()).length; i++) {
    let li = document.createElement("li");
    li.innerHTML =
      "<i>" +
      parseInt(i + 1) +
      '.</i><a href="lesson.html?r=' +
      getLessonsOf(getCurrentChapter())[i].path +
      '">' +
      getLessonsOf(getCurrentChapter())[i].name +
      "</a>";
    lessonList.appendChild(li);
  }
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

function getLessonsOf(chapter) {
  let lessons = [];
  for (let i = 0; i < chapter.lessons.length; i++) {
    lessons.push(chapter.lessons[i]);
  }
  return lessons;
}

function isLesson(page) {
  return !page.hasOwnProperty("lessons");
}

function getCurrentPage() {
  let pages = getAllPages();
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].path == getLessonReq()) {
      return pages[i];
    }
  }
}

function getCurrentChapter() {
  if (!isLesson(getCurrentPage())) return getCurrentPage();
  for (let i = 0; i < chapters.length; i++) {
    for (let j = 0; j < chapters[i].lessons.length; j++) {
      if (chapters[i].lessons[j].path == getLessonReq()) {
        return chapters[i];
      }
    }
  }
}
