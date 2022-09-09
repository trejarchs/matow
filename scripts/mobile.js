/*============
    * ELEMENTI
    =============*/
    const menuContent = document.getElementById("menu-content");
    const searchBarMobile = document.getElementById("searchbar-mobile");
    const searchBar = document.getElementById("search-bar");
    const searchBtn = document.getElementById("searchbtn-mobile");
    const menuIcon = document.querySelectorAll("#menu-btn-mobile i")[0];
    const main = document.getElementsByClassName("main")[0];
    const darkBtnContainer = document.getElementById("dark-btn-mobile-container");
    const darkBtnMobile = document.getElementById("dark-btn-mobile");
    const darkBtnSpan = document.querySelectorAll("#dark-btn-mobile-container span")[0];
    
    
    /*============
        * FUNZIONI
        =============*/
    /* Se il menu è attivo e l'utente clicca fuori dalla topbar
     * oppure scrolla la pagina, chiude il menu */
    main.onclick = function () {
        closeMenu()
    }
    window.onscroll = function () {
        closeMenu()
    }
    window.onload = function () {
        searchBar.value = "";
    }

    //check if user's browser is using dark mode
    function checkDarkMode() {
        if (localStorage.getItem('alreadyChecked') != 'true') {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                darkMode();
                localStorage.setItem('alreadyChecked', 'true');
            } else {
                lightMode();
                localStorage.setItem('alreadyChecked', 'true');
            }
        }
    }

    checkDarkMode();
    
    
    /* Funzioni per gestire la pressione del menu-btn
     * visibile dal cellulare */
    function toggleMenu() {
        isMenuActive() ? closeMenu() : openMenu()
    }
    
    function isMenuActive() {
        return menuContent.style.height == "120px"
    }
    
    function closeMenu() {
        searchBarMobile.style.display = "none"
        searchBtn.style.display = "none"
        darkBtnMobile.style.display = "none"
        darkBtnSpan.style.display = "none"
        darkBtnContainer.style.borderTop = "none"
        menuContent.style.height = "0px"
        menuIcon.className = "bx bx-menu"
        menuIcon.style.fontSize = "36px"
    }
    
    function openMenu() {    
        searchBarMobile.style.display = "block"
        searchBtn.style.display = "block"
        darkBtnMobile.style.display = "block"
        darkBtnSpan.style.display = "block"
        darkBtnContainer.style.borderTop = "2px solid var(--side-border-color)"
        menuContent.style.height = "120px"
        menuIcon.className = "bx bx-x"
        menuIcon.style.fontSize = "42px"
    }
    
    function search() {
        let searchValue = searchBarMobile.value || searchBar.value;
        if (searchValue != "") {
            window.location.href = "search.html?q=" + searchValue
        }
    };

    searchBar.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            search();
        }
    });

    searchBarMobile.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            search();
        }
    });

    function toggleDarkMode() {
        isDarkMode() ? lightMode() : darkMode()
        isDarkMode() ? darkSynstax() : lightSynstax();
    };

    function isDarkMode() {
        return localStorage.getItem("darkMode") == "true"
    };

    if (isDarkMode()) {
        darkMode()
    } else {
        lightMode()
    };

    function lightSynstax() {
        let theme = zero.shadowRoot.querySelectorAll('link')[0];
        theme.href = "https://cdn.jsdelivr.net/gh/PrismJS/prism@1/themes/prism.min.css"
    }

    function darkSynstax() {
        let theme = zero.shadowRoot.querySelectorAll('link')[0];
        theme.href = "https://cdn.jsdelivr.net/gh/PrismJS/prism@1/themes/prism-okaidia.min.css"
    }


    function darkMode() {
        localStorage.setItem("darkMode", "true");
        document.querySelector('#logo-name').src = "images/unipg-name-dark.png";
        if (document.querySelector('#dark-btn i') != null) {
            document.querySelector('#dark-btn i').className = "bx bx-sun";
        }
        if (document.querySelector('#dark-btn-homepage i') != null) {
            document.querySelector('#dark-btn-homepage i').className = "bx bx-sun";
        }
        if (document.querySelector('#dark-btn-mobile i') != null) {
            document.querySelector('#dark-btn-mobile i').className = "bx bx-sun";
        }
        darkBtnSpan.textContent = "Attiva modalità giorno";
        const r = document.querySelector(':root');
        r.style.setProperty('--bg-color', 'var(--grey-2)');
        r.style.setProperty('--text-color', 'var(--white-2)');
        r.style.setProperty('--h12-color', 'var(--white-2)');
        r.style.setProperty('--h3-color', 'var(--grey-7)');
        r.style.setProperty('--top-btn-color', 'var(--grey-8)');
        r.style.setProperty('--btn-bg-color', 'var(--grey-trans)');
        r.style.setProperty('--box-shadow-color', 'var(--black-2)');
        r.style.setProperty('--link-color', 'var(--blue-4)');
        r.style.setProperty('--link-focus-color', 'var(--red-1)');
        r.style.setProperty('--side-bg-color', 'var(--grey-1)');
        r.style.setProperty('--side-h3-color', 'var(--grey-6)');
        r.style.setProperty('--side-border-color', 'var(--grey-5)');
        r.style.setProperty('--side-btn-color', 'var(--grey-9)');
        r.style.setProperty('--pathnav-elem-color', 'var(--grey-9)');
        r.style.setProperty('--nav-border-color', 'var(--grey-9)');
        r.style.setProperty('--nav-i-color', 'var(--white-2)');
        r.style.setProperty('--nav-i-hover-color', 'var(--white-2)');
        r.style.setProperty('--nav-text-color', 'var(--white-2)');
        r.style.setProperty('--footer-bg-color', 'var(--grey-1)');
        r.style.setProperty('--ch-grid-color', 'var(--grey-7)');
        r.style.setProperty('--code-color', 'var(--grey-4)');
    }

    function lightMode() {
        localStorage.setItem("darkMode", "false");
        document.querySelector('#logo-name').src = "images/unipg-name.png";
        if (document.querySelector('#dark-btn i') != null) {
            document.querySelector('#dark-btn i').className = "bx bx-moon";
        }
        if (document.querySelector('#dark-btn-homepage i') != null) {
            document.querySelector('#dark-btn-homepage i').className = "bx bx-moon";
        }
        if (document.querySelector('#dark-btn-mobile i') != null) {
            document.querySelector('#dark-btn-mobile i').className = "bx bx-moon";
        }
        darkBtnSpan.textContent = "Attiva modalità notte";
        const r = document.querySelector(':root');
        r.style.setProperty('--bg-color', 'var(--white-1)');
        r.style.setProperty('--text-color', 'var(--grey-3)');
        r.style.setProperty('--h12-color', 'var(--blue-2)');
        r.style.setProperty('--h3-color', 'var(--grey-4)');
        r.style.setProperty('--top-btn-color', 'var(--grey-8)');
        r.style.setProperty('--btn-bg-color', 'var(--grey-trans)');
        r.style.setProperty('--box-shadow-color', 'var(--grey-10)');
        r.style.setProperty('--link-color', 'var(--blue-3)');
        r.style.setProperty('--link-focus-color', 'var(--red-1)');
        r.style.setProperty('--side-bg-color', 'var(--grey-7)');
        r.style.setProperty('--side-h3-color', 'var(--blue-3)');
        r.style.setProperty('--side-border-color', 'var(--grey-8)');
        r.style.setProperty('--side-btn-color', 'var(--blue-2)');
        r.style.setProperty('--pathnav-elem-color', 'var(--grey-3)');
        r.style.setProperty('--nav-border-color', 'var(--grey-7)');
        r.style.setProperty('--nav-i-color', 'var(--grey-4)');
        r.style.setProperty('--nav-i-hover-color', 'var(--blue-2)');
        r.style.setProperty('--nav-text-color', 'var(--grey-3)');
        r.style.setProperty('--footer-bg-color', 'var(--grey-4)');
        r.style.setProperty('--ch-grid-color', 'var(--grey-7)');
        r.style.setProperty('--code-color', 'var(--grey-7)');
    }



    



    
    
    
    