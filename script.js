/* =========================================================
   CONFIGURAZIONE
========================================================= */

const correctPassword = "9/08/2026";

/*
 * Data ufficiale da cui siete fidanzati.
 * Formato: anno, mese - 1, giorno
 */
const relationshipStart = new Date(
    2026,
    7,
    9
);


/* =========================================================
   ELEMENTI
========================================================= */

const passwordScreen =
    document.getElementById("passwordScreen");

const passwordInput =
    document.getElementById("passwordInput");

const passwordBtn =
    document.getElementById("passwordBtn");

const passwordError =
    document.getElementById("passwordError");

const passwordSuccess =
    document.getElementById("passwordSuccess");

const book =
    document.getElementById("book");

const pages =
    Array.from(
        document.querySelectorAll(".page")
    );

const dotsContainer =
    document.getElementById("dots");

const prevBtn =
    document.getElementById("prevBtn");

const nextBtn =
    document.getElementById("nextBtn");

const startBtn =
    document.getElementById("startBtn");

const pageFlash =
    document.getElementById("pageFlash");

const currentPageNumber =
    document.getElementById("currentPageNumber");

const totalPageNumber =
    document.getElementById("totalPageNumber");

const daysTogether =
    document.getElementById("daysTogether");

const ambientParticles =
    document.getElementById("ambientParticles");


/* =========================================================
   STATO
========================================================= */

let currentPage = 0;

let touchStartX = 0;
let touchStartY = 0;

let gameStarted = false;

let unlockedMemories = new Set();


/* =========================================================
   DOTS
========================================================= */

pages.forEach(
    (page, index) => {

        const dot =
            document.createElement("button");

        dot.className = "dot";

        dot.setAttribute(
            "aria-label",
            `Vai alla pagina ${index + 1}`
        );

        dot.addEventListener(
            "click",
            () => {
                goToPage(index);
            }
        );

        dotsContainer.appendChild(dot);
    }
);


const dots =
    Array.from(
        dotsContainer.querySelectorAll(".dot")
    );


/* =========================================================
   NUMERO PAGINE
========================================================= */

totalPageNumber.textContent =
    String(pages.length).padStart(2, "0");


/* =========================================================
   NAVIGAZIONE
========================================================= */

function updateNavigation() {

    dots.forEach(
        (dot, index) => {

            dot.classList.toggle(
                "active",
                index === currentPage
            );
        }
    );


    prevBtn.disabled =
        currentPage === 0;


    nextBtn.disabled =
        currentPage === pages.length - 1;


    currentPageNumber.textContent =
        String(currentPage + 1).padStart(2, "0");
}


/* =========================================================
   FLASH
========================================================= */

function triggerPageFlash() {

    pageFlash.classList.remove("flash");

    void pageFlash.offsetWidth;

    pageFlash.classList.add("flash");
}


/* =========================================================
   VAI ALLA PAGINA
========================================================= */

function goToPage(index) {

    index =
        Math.max(
            0,
            Math.min(
                index,
                pages.length - 1
            )
        );


    if (index === currentPage) {
        return;
    }


    currentPage = index;

    triggerPageFlash();


    book.scrollTo({
        left:
            index *
            window.innerWidth,

        behavior: "smooth"
    });


    updateNavigation();


    /*
     * Se esce dalla pagina del video,
     * mettiamo in pausa il video.
     */

    const video =
        document.getElementById(
            "memoryVideo"
        );

    if (
        video &&
        index !== 4
    ) {
        video.pause();
    }
}


/* =========================================================
   PAGINA SUCCESSIVA
========================================================= */

function nextPage() {

    if (
        currentPage <
        pages.length - 1
    ) {
        goToPage(
            currentPage + 1
        );
    }
}


/* =========================================================
   PAGINA PRECEDENTE
========================================================= */

function previousPage() {

    if (currentPage > 0) {
        goToPage(
            currentPage - 1
        );
    }
}


/* =========================================================
   FRECCE
========================================================= */

nextBtn.addEventListener(
    "click",
    nextPage
);

prevBtn.addEventListener(
    "click",
    previousPage
);


/* =========================================================
   TASTIERA
========================================================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            document.activeElement ===
            passwordInput
        ) {
            return;
        }

        if (
            event.key ===
            "ArrowRight"
        ) {
            nextPage();
        }

        if (
            event.key ===
            "ArrowLeft"
        ) {
            previousPage();
        }
    }
);


/* =========================================================
   SWIPE MOBILE
========================================================= */

book.addEventListener(
    "touchstart",
    (event) => {

        const touch =
            event.changedTouches[0];

        touchStartX =
            touch.clientX;

        touchStartY =
            touch.clientY;
    },
    {
        passive: true
    }
);


book.addEventListener(
    "touchend",
    (event) => {

        const touch =
            event.changedTouches[0];

        const touchEndX =
            touch.clientX;

        const touchEndY =
            touch.clientY;


        const deltaX =
            touchEndX -
            touchStartX;

        const deltaY =
            touchEndY -
            touchStartY;


        const minimumSwipe = 50;


        /*
         * Non interferire con lo
         * scroll verticale delle pagine.
         */

        if (
            Math.abs(deltaY) >
            Math.abs(deltaX)
        ) {
            return;
        }


        if (
            Math.abs(deltaX) <
            minimumSwipe
        ) {
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


/* =========================================================
   SCROLL
========================================================= */

book.addEventListener(
    "scroll",
    () => {

        const newPage =
            Math.round(
                book.scrollLeft /
                window.innerWidth
            );


        if (
            newPage !==
            currentPage
        ) {

            currentPage =
                Math.max(
                    0,
                    Math.min(
                        newPage,
                        pages.length - 1
                    )
                );

            updateNavigation();
        }
    },
    {
        passive: true
    }
);


/* =========================================================
   BOTTONE INIZIA
========================================================= */

startBtn.addEventListener(
    "click",
    () => {

        nextPage();

    }
);


/* =========================================================
   PASSWORD — FORMATTAZIONE
========================================================= */

function formatPassword(value) {

    let digits =
        value.replace(
            /\D/g,
            ""
        );


    /*
     * La data è:
     * 9 / 08 / 2026
     *
     * Totale 7 cifre.
     */

    if (
        digits.length > 7
    ) {
        digits =
            digits.substring(
                0,
                7
            );
    }


    let formatted = "";


    if (
        digits.length > 0
    ) {
        formatted +=
            digits.substring(
                0,
                1
            );
    }


    if (
        digits.length > 1
    ) {

        formatted += "/";

        formatted +=
            digits.substring(
                1,
                3
            );
    }


    if (
        digits.length > 3
    ) {

        formatted += "/";

        formatted +=
            digits.substring(
                3,
                7
            );
    }


    return formatted;
}


passwordInput.addEventListener(
    "input",
    () => {

        passwordInput.value =
            formatPassword(
                passwordInput.value
            );

        passwordError.classList.remove(
            "show"
        );
    }
);


/* =========================================================
   PASSWORD
========================================================= */

function checkPassword() {

    const value =
        passwordInput.value.trim();


    if (
        value ===
        correctPassword
    ) {

        passwordError.classList.remove(
            "show"
        );

        passwordSuccess.classList.add(
            "show"
        );


        createBurstOfHearts();


        setTimeout(
            () => {

                passwordScreen.classList.add(
                    "hidden"
                );


                setTimeout(
                    () => {

                        passwordSuccess.classList.remove(
                            "show"
                        );

                    },
                    500
                );

            },
            800
        );

    } else {

        passwordSuccess.classList.remove(
            "show"
        );

        passwordError.classList.remove(
            "show"
        );


        void passwordError.offsetWidth;


        passwordError.classList.add(
            "show"
        );


        passwordInput.classList.add(
            "shake"
        );


        setTimeout(
            () => {

                passwordInput.classList.remove(
                    "shake"
                );

            },
            450
        );
    }
}


passwordBtn.addEventListener(
    "click",
    checkPassword
);


/* =========================================================
   ENTER PASSWORD
========================================================= */

passwordInput.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key ===
            "Enter"
        ) {
            checkPassword();
        }
    }
);


/* =========================================================
   CONTATORE GIORNI
========================================================= */

function calculateDaysTogether() {

    const now =
        new Date();


    /*
     * Normalizziamo le date a mezzanotte
     * per evitare problemi con ore/minuti.
     */

    const start =
        new Date(
            relationshipStart
        );

    start.setHours(
        0,
        0,
        0,
        0
    );


    const today =
        new Date(
            now
        );

    today.setHours(
        0,
        0,
        0,
        0
    );


    const difference =
        today.getTime() -
        start.getTime();


    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );


    return Math.max(
        0,
        days
    );
}


function updateDaysCounter() {

    const target =
        calculateDaysTogether();


    const current =
        Number(
            daysTogether.textContent
        ) || 0;


    if (
        current === target
    ) {
        return;
    }


    /*
     * Se la differenza è piccola,
     * facciamo una piccola animazione.
     */

    if (
        Math.abs(
            target - current
        ) < 20
    ) {

        let value = current;

        const step =
            target > current
                ? 1
                : -1;


        const interval =
            setInterval(
                () => {

                    value += step;

                    daysTogether.textContent =
                        value;


                    daysTogether.classList.remove(
                        "counting"
                    );

                    void daysTogether.offsetWidth;

                    daysTogether.classList.add(
                        "counting"
                    );


                    if (
                        value === target
                    ) {

                        clearInterval(
                            interval
                        );
                    }

                },
                45
            );

    } else {

        daysTogether.textContent =
            target;
    }
}


updateDaysCounter();


/*
 * Aggiorna il numero ogni minuto.
 * In questo modo, se la pagina rimane aperta
 * fino a mezzanotte, il numero cambia.
 */

setInterval(
    updateDaysCounter,
    60000
);


/* =========================================================
   PARTICELLE / CUORI
========================================================= */

function createAmbientParticles() {

    const symbols = [
        "♥",
        "♡",
        "✦",
        "·"
    ];


    const amount =
        window.innerWidth <= 700
            ? 20
            : 34;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const particle =
            document.createElement(
                "span"
            );


        particle.className =
            "ambient-particle";


        particle.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];


        particle.style.left =
            `${Math.random() * 100}%`;


        particle.style.fontSize =
            `${6 + Math.random() * 10}px`;


        particle.style.animationDuration =
            `${13 + Math.random() * 18}s`;


        particle.style.animationDelay =
            `${Math.random() * -25}s`;


        particle.style.setProperty(
            "--move-x",
            `${-100 + Math.random() * 200}px`
        );


        ambientParticles.appendChild(
            particle
        );
    }
}


function createBurstOfHearts() {

    const amount = 18;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const heart =
            document.createElement(
                "span"
            );


        heart.textContent =
            Math.random() > 0.5
                ? "♥"
                : "♡";


        heart.style.position =
            "fixed";

        heart.style.left =
            `${50 + (Math.random() * 30 - 15)}%`;

        heart.style.top =
            `${50 + (Math.random() * 20 - 10)}%`;

        heart.style.zIndex =
            "110";

        heart.style.pointerEvents =
            "none";

        heart.style.color =
            "#ff72ad";

        heart.style.fontSize =
            `${10 + Math.random() * 15}px`;

        heart.style.transition =
            "all 1.2s ease";

        document.body.appendChild(
            heart
        );


        requestAnimationFrame(
            () => {

                heart.style.transform =
                    `translate(
                        ${(Math.random() - 0.5) * 300}px,
                        ${(Math.random() - 0.5) * 300}px
                    ) scale(${0.5 + Math.random()})`;

                heart.style.opacity =
                    "0";

            }
        );


        setTimeout(
            () => {
                heart.remove();
            },
            1300
        );
    }
}


createAmbientParticles();


/* =========================================================
   MINI GIOCO
========================================================= */

const startGameBtn =
    document.getElementById(
        "startGameBtn"
    );

const gameIntro =
    document.getElementById(
        "gameIntro"
    );

const gameBoard =
    document.getElementById(
        "gameBoard"
    );

const gameProgress =
    document.getElementById(
        "gameProgress"
    );

const memoryReveal =
    document.getElementById(
        "memoryReveal"
    );

const closeMemoryBtn =
    document.getElementById(
        "closeMemoryBtn"
    );

const revealEyebrow =
    document.getElementById(
        "revealEyebrow"
    );

const revealTitle =
    document.getElementById(
        "revealTitle"
    );

const revealDescription =
    document.getElementById(
        "revealDescription"
    );

const revealImage =
    document.getElementById(
        "revealImage"
    );

const gameComplete =
    document.getElementById(
        "gameComplete"
    );

const unlockFinalBtn =
    document.getElementById(
        "unlockFinalBtn"
    );

const finalMemory =
    document.getElementById(
        "finalMemory"
    );

const finishGameBtn =
    document.getElementById(
        "finishGameBtn"
    );


/* =========================================================
   DATI DEI RICORDI
========================================================= */

const memories = {

    1: {

        eyebrow:
            "RICORDO #01 — PROVA DI STYLING",

        title:
            "Il mio talento da stylist 😂",

        image:
            "images/foto7.jpg",

        description: `
            <p>
                Ricordi questo capolavoro?
            </p>

            <p>
                Ebbene sì...
                <strong>l'outfit l'avevo scelto io.</strong> 😂
            </p>

            <p>
                Non so esattamente cosa mi passasse
                per la testa quel giorno,
                ma evidentemente ero convinto
                di avere un futuro nella moda.
            </p>

            <p>
                Dopo questa foto ho ufficialmente perso
                il diritto di scegliere i tuoi vestiti. 😭
            </p>

            <p>
                Però almeno una cosa l'ho azzeccata:
                quel momento insieme me lo ricordo ancora
                con un sorriso. ❤️
            </p>

            <p>
                <strong>
                    Punteggio come stylist: 2/10.
                </strong>
            </p>
        `
    },


    2: {

        eyebrow:
            "RICORDO #02 — DOCUMENTO CLASSIFICATO",

        title:
            "Prova classificata 💄",

        image:
            "images/foto8.jpg",

        description: `
            <p>
                🚨 Una delle tante prove che per te
                sono disposto a fare cose
                che normalmente non farei mai.
            </p>

            <p>
                Tipo questa.
            </p>

            <p>
                Sì...
                <strong>mi sono fatto truccare.</strong> 😂
            </p>

            <p>
                E sì, probabilmente lo rifarei.
            </p>

            <p>
                Non perché mi piaccia particolarmente
                farmi truccare,
                ma perché alla fine quello che conta
                è che quel momento l'abbiamo vissuto insieme.
            </p>

            <p>
                E adesso questa foto è diventata
                una di quelle cose che riguarderemo
                tra qualche anno e diremo:
            </p>

            <p>
                <strong>
                    "Ma perché eravamo così?" 😂❤️
                </strong>
            </p>
        `
    },


    3: {

        eyebrow:
            "RICORDO #03 — QUESTO È DIVERSO",

        title:
            "Un posto dove tornare 🫂",

        image:
            "images/foto9.jpg",

        description: `
            <p>
                Questo è diverso dagli altri.
            </p>

            <p>
                Non c'è niente da ridere.
                Non c'è niente da sbloccare.
            </p>

            <p>
                <strong>
                    Solo noi.
                </strong>
            </p>

            <p>
                Non so se te l'ho mai detto,
                ma ci sono momenti in cui un abbraccio
                dice molto più di qualsiasi parola.
            </p>

            <p>
                Quindi se un giorno ti manco,
                se hai avuto una giornata brutta,
                oppure semplicemente vorresti
                che fossi lì...
            </p>

            <p>
                <strong>
                    torna qui.
                </strong>
            </p>

            <p>
                Guarda questa foto.
                E immagina che io sia lì ad abbracciarti.
            </p>

            <p>
                Perché anche se in quel momento
                non posso esserci davvero,
                <strong>
                    vorrei esserci. Sempre. ❤️
                </strong>
            </p>
        `
    }

};


/* =========================================================
   AVVIO GIOCO
========================================================= */

startGameBtn.addEventListener(
    "click",
    () => {

        gameStarted = true;

        gameIntro.classList.add(
            "hidden"
        );

        gameBoard.classList.add(
            "active"
        );

        createBurstOfHearts();
    }
);


/* =========================================================
   SBLOCCA RICORDO
========================================================= */

const memoryCards =
    Array.from(
        document.querySelectorAll(
            ".game-card"
        )
    );


memoryCards.forEach(
    (card) => {

        const button =
            card.querySelector(
                ".unlock-btn"
            );


        button.addEventListener(
            "click",
            () => {

                const memoryId =
                    card.dataset.memory;


                unlockMemory(
                    memoryId,
                    card
                );
            }
        );
    }
);


/* =========================================================
   FUNZIONE SBLOCCO
========================================================= */

function unlockMemory(
    memoryId,
    card
) {

    const memory =
        memories[memoryId];


    if (!memory) {
        return;
    }


    unlockedMemories.add(
        memoryId
    );


    card.classList.add(
        "unlocked"
    );


    card.querySelector(
        ".card-lock"
    ).textContent = "✓";


    card.querySelector(
        ".unlock-btn"
    ).textContent =
        "Rivedi ricordo";


    updateGameProgress();


    revealEyebrow.textContent =
        memory.eyebrow;

    revealTitle.textContent =
        memory.title;

    revealDescription.innerHTML =
        memory.description;

    revealImage.src =
        memory.image;


    memoryReveal.classList.add(
        "active"
    );


    createBurstOfHearts();
}


/* =========================================================
   CHIUDI RICORDO
========================================================= */

closeMemoryBtn.addEventListener(
    "click",
    () => {

        memoryReveal.classList.remove(
            "active"
        );

        checkGameCompletion();
    }
);


/* =========================================================
   CLICK FUORI DAL RICORDO
========================================================= */

memoryReveal.addEventListener(
    "click",
    (event) => {

        if (
            event.target ===
            memoryReveal
        ) {

            memoryReveal.classList.remove(
                "active"
            );

            checkGameCompletion();
        }
    }
);


/* =========================================================
   PROGRESSO
========================================================= */

function updateGameProgress() {

    gameProgress.textContent =
        unlockedMemories.size;
}


/* =========================================================
   CONTROLLO COMPLETAMENTO
========================================================= */

function checkGameCompletion() {

    if (
        unlockedMemories.size === 3
    ) {

        setTimeout(
            () => {

                gameComplete.classList.add(
                    "active"
                );

            },
            350
        );
    }
}


/* =========================================================
   ULTIMO RICORDO
========================================================= */

unlockFinalBtn.addEventListener(
    "click",
    () => {

        gameComplete.classList.remove(
            "active"
        );

        setTimeout(
            () => {

                finalMemory.classList.add(
                    "active"
                );

                createBurstOfHearts();

            },
            350
        );
    }
);


/* =========================================================
   FINE GIOCO
========================================================= */

finishGameBtn.addEventListener(
    "click",
    () => {

        finalMemory.classList.remove(
            "active"
        );


        setTimeout(
            () => {

                goToPage(
                    pages.length - 1
                );

            },
            500
        );
    }
);


/* =========================================================
   VIDEO
========================================================= */

const memoryVideo =
    document.getElementById(
        "memoryVideo"
    );


if (memoryVideo) {

    memoryVideo.addEventListener(
        "play",
        () => {

            memoryVideo.parentElement.classList.add(
                "playing"
            );

        }
    );


    memoryVideo.addEventListener(
        "pause",
        () => {

            memoryVideo.parentElement.classList.remove(
                "playing"
            );

        }
    );
}


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        book.scrollTo({
            left:
                currentPage *
                window.innerWidth,

            behavior: "auto"
        });


        updateNavigation();
    }
);


/* =========================================================
   AVVIO
========================================================= */

updateNavigation();

passwordInput.focus();
