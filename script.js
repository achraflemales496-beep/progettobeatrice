const correctPassword = "9/08/2026";

const passwordScreen = document.getElementById("passwordScreen");
const passwordInput = document.getElementById("passwordInput");
const passwordBtn = document.getElementById("passwordBtn");
const passwordError = document.getElementById("passwordError");
const passwordSuccess = document.getElementById("passwordSuccess");

const book = document.getElementById("book");
const pages = Array.from(document.querySelectorAll(".page"));

const dotsContainer = document.getElementById("dots");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const startBtn = document.getElementById("startBtn");

let currentPage = 0;

let touchStartX = 0;
let touchStartY = 0;


/* =========================
   DOTS
========================= */

pages.forEach((page, index) => {

    const dot = document.createElement("button");

    dot.className = "dot";

    dot.setAttribute(
        "aria-label",
        `Vai alla pagina ${index + 1}`
    );

    dot.addEventListener("click", () => {
        goToPage(index);
    });

    dotsContainer.appendChild(dot);
});


const dots = Array.from(
    dotsContainer.querySelectorAll(".dot")
);


/* =========================
   AGGIORNA NAVIGAZIONE
========================= */

function updateNavigation() {

    dots.forEach((dot, index) => {
        dot.classList.toggle(
            "active",
            index === currentPage
        );
    });

    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === pages.length - 1;
}


/* =========================
   VAI ALLA PAGINA
========================= */

function goToPage(index) {

    if (index < 0) {
        index = 0;
    }

    if (index > pages.length - 1) {
        index = pages.length - 1;
    }

    currentPage = index;

    book.scrollTo({
        left: index * window.innerWidth,
        behavior: "smooth"
    });

    updateNavigation();
}


/* =========================
   PAGINA SUCCESSIVA
========================= */

function nextPage() {

    if (currentPage < pages.length - 1) {
        goToPage(currentPage + 1);
    }
}


/* =========================
   PAGINA PRECEDENTE
========================= */

function previousPage() {

    if (currentPage > 0) {
        goToPage(currentPage - 1);
    }
}


/* =========================
   FRECCE
========================= */

nextBtn.addEventListener("click", nextPage);

prevBtn.addEventListener("click", previousPage);


/* =========================
   TASTIERA
========================= */

document.addEventListener("keydown", (event) => {

    if (document.activeElement === passwordInput) {
        return;
    }

    if (event.key === "ArrowRight") {
        nextPage();
    }

    if (event.key === "ArrowLeft") {
        previousPage();
    }
});


/* =========================
   SWIPE MOBILE
========================= */

book.addEventListener(
    "touchstart",
    (event) => {

        const touch = event.changedTouches[0];

        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    },
    {
        passive: true
    }
);


book.addEventListener(
    "touchend",
    (event) => {

        const touch = event.changedTouches[0];

        const touchEndX = touch.clientX;
        const touchEndY = touch.clientY;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        const minimumSwipe = 50;

        /*
         * Ignora gli swipe principalmente verticali.
         */
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
            return;
        }

        if (Math.abs(deltaX) < minimumSwipe) {
            return;
        }

        if (deltaX < 0) {
            nextPage();
        } else {
            previousPage();
        }
    },
    {
        passive: true
    }
);


/* =========================
   SCROLL
========================= */

book.addEventListener(
    "scroll",
    () => {

        const newPage = Math.round(
            book.scrollLeft / window.innerWidth
        );

        if (newPage !== currentPage) {

            currentPage = Math.max(
                0,
                Math.min(newPage, pages.length - 1)
            );

            updateNavigation();
        }
    },
    {
        passive: true
    }
);


/* =========================
   BOTTONE INIZIA
========================= */

startBtn.addEventListener(
    "click",
    () => {
        nextPage();
    }
);


/* =========================
   PASSWORD
========================= */

function formatPassword(value) {

    let digits = value.replace(/\D/g, "");

    /*
     * Massimo:
     * 1 cifra giorno
     * 2 cifre mese
     * 4 cifre anno
     */

    if (digits.length > 7) {
        digits = digits.substring(0, 7);
    }

    let formatted = "";

    if (digits.length > 0) {
        formatted += digits.substring(0, 1);
    }

    if (digits.length > 1) {
        formatted += "/";
        formatted += digits.substring(1, 3);
    }

    if (digits.length > 3) {
        formatted += "/";
        formatted += digits.substring(3, 7);
    }

    return formatted;
}


passwordInput.addEventListener(
    "input",
    () => {

        passwordInput.value = formatPassword(
            passwordInput.value
        );

        passwordError.classList.remove("show");
    }
);


/* =========================
   CONTROLLO PASSWORD
========================= */

function checkPassword() {

    const value = passwordInput.value.trim();

    if (value === correctPassword) {

        passwordError.classList.remove("show");

        passwordSuccess.classList.add("show");

        setTimeout(() => {

            passwordScreen.classList.add("hidden");

            setTimeout(() => {
                passwordSuccess.classList.remove("show");
            }, 500);

        }, 600);

    } else {

        passwordSuccess.classList.remove("show");

        passwordError.classList.remove("show");

        /*
         * Piccolo ritardo per permettere
         * all'animazione di ripartire.
         */

        void passwordError.offsetWidth;

        passwordError.classList.add("show");
    }
}


passwordBtn.addEventListener(
    "click",
    checkPassword
);


/* =========================
   ENTER PASSWORD
========================= */

passwordInput.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {
            checkPassword();
        }
    }
);


/* =========================
   AVVIO
========================= */

updateNavigation();

passwordInput.focus();


/* =========================
   RESIZE
========================= */

window.addEventListener(
    "resize",
    () => {

        book.scrollTo({
            left: currentPage * window.innerWidth,
            behavior: "auto"
        });

        updateNavigation();
    }
);s
