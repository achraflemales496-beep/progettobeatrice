
// ========================================
// PASSWORD
// ========================================

const correctPassword = "9/08/2026";

const passwordScreen = document.getElementById("passwordScreen");
const passwordInput = document.getElementById("passwordInput");
const passwordBtn = document.getElementById("passwordBtn");
const passwordError = document.getElementById("passwordError");

// Inserimento automatico degli /
passwordInput.addEventListener("input", () => {
    let value = passwordInput.value.replace(/\D/g, "");

    // Giorno
    if (value.length > 1) {
        value = value.slice(0, 1) + "/" + value.slice(1);
    }

    // Mese
    if (value.length > 4) {
        value = value.slice(0, 4) + "/" + value.slice(4);
    }

    // Massimo: 9/08/2026
    value = value.slice(0, 9);

    passwordInput.value = value;
});

function checkPassword() {
    const enteredPassword = passwordInput.value.trim();

    if (enteredPassword === correctPassword) {
        // Password corretta
        passwordScreen.classList.add("hidden");

        // Porta il cursore fuori dal campo
        passwordInput.blur();

    } else {
        // Password sbagliata
        passwordError.classList.add("show");

        // Svuota il campo
        passwordInput.value = "";

        // Rimette il focus sull'input
        passwordInput.focus();

        // Fa sparire il messaggio dopo 2.5 secondi
        setTimeout(() => {
            passwordError.classList.remove("show");
        }, 2500);
    }
}

// Pulsante "Entra"
passwordBtn.addEventListener("click", checkPassword);

// Premere INVIO per entrare
passwordInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        checkPassword();
    }
});


// ========================================
// ALBUM / PAGINE
// ========================================

const album = document.getElementById("album");
const pages = document.querySelectorAll(".page");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const dots = document.querySelectorAll(".dot");

const startBtn = document.getElementById("startBtn");

let currentPage = 0;


// ========================================
// AGGIORNA PAGINA
// ========================================

function updatePage(index) {
    if (index < 0) {
        index = 0;
    }

    if (index >= pages.length) {
        index = pages.length - 1;
    }

    currentPage = index;

    pages[currentPage].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
    });

    // Aggiorna i pallini
    dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentPage);
    });

    // Aggiorna pulsante precedente
    if (currentPage === 0) {
        prevBtn.classList.add("disabled");
    } else {
        prevBtn.classList.remove("disabled");
    }

    // Aggiorna pulsante successivo
    if (currentPage === pages.length - 1) {
        nextBtn.classList.add("disabled");
    } else {
        nextBtn.classList.remove("disabled");
    }
}


// ========================================
// PAGINA SUCCESSIVA
// ========================================

function nextPage() {
    if (currentPage < pages.length - 1) {
        updatePage(currentPage + 1);
    }
}


// ========================================
// PAGINA PRECEDENTE
// ========================================

function previousPage() {
    if (currentPage > 0) {
        updatePage(currentPage - 1);
    }
}


// ========================================
// PULSANTI
// ========================================

nextBtn.addEventListener("click", nextPage);

prevBtn.addEventListener("click", previousPage);


// ========================================
// PALLINI DI NAVIGAZIONE
// ========================================

dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        updatePage(index);
    });
});


// ========================================
// BOTTONE INIZIA
// ========================================

if (startBtn) {
    startBtn.addEventListener("click", () => {
        updatePage(1);
    });
}


// ========================================
// TASTIERA
// ========================================

document.addEventListener("keydown", (event) => {

    // Se la password è ancora visibile,
    // non permettere la navigazione dell'album
    if (!passwordScreen.classList.contains("hidden")) {
        return;
    }

    if (event.key === "ArrowRight") {
        nextPage();
    }

    if (event.key === "ArrowLeft") {
        previousPage();
    }
});


// ========================================
// SWIPE SU TELEFONO
// ========================================

let touchStartX = 0;
let touchEndX = 0;

album.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX;
});

album.addEventListener("touchend", (event) => {
    touchEndX = event.changedTouches[0].screenX;

    handleSwipe();
});

function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;

    // Evita piccoli movimenti accidentali
    if (Math.abs(swipeDistance) < 50) {
        return;
    }

    // Swipe verso sinistra
    if (swipeDistance < 0) {
        nextPage();
    }

    // Swipe verso destra
    if (swipeDistance > 0) {
        previousPage();
    }
}


// ========================================
// RILEVAMENTO SCROLL
// ========================================

let scrollTimeout;

album.addEventListener("scroll", () => {

    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {

        let closestPage = 0;
        let smallestDistance = Infinity;

        pages.forEach((page, index) => {

            const rect = page.getBoundingClientRect();

            const distance = Math.abs(
                rect.left - (window.innerWidth / 2 - rect.width / 2)
            );

            if (distance < smallestDistance) {
                smallestDistance = distance;
                closestPage = index;
            }
        });

        currentPage = closestPage;

        // Aggiorna pallini
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentPage);
        });

        // Aggiorna frecce
        if (currentPage === 0) {
            prevBtn.classList.add("disabled");
        } else {
            prevBtn.classList.remove("disabled");
        }

        if (currentPage === pages.length - 1) {
            nextBtn.classList.add("disabled");
        } else {
            nextBtn.classList.remove("disabled");
        }

    }, 100);
});


// ========================================
// INIZIALIZZAZIONE
// ========================================

updatePage(0);

// Focus automatico sulla password
window.addEventListener("load", () => {
    passwordInput.focus();
});
