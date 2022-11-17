"use strict"

const playingField = document.querySelector('.playing-field'),
    main = document.querySelector('.main'),
    logo = document.createElement('img'),
    promo = document.createElement('div'),
    winBlock = document.createElement('div'),
    winImg = document.createElement('img'),
    buttonStart = document.createElement('button'),
    buttonRestart = document.createElement('div'),
    imgRestart = document.createElement('img'),
    textRestart = document.createElement('p'),
    audio = document.createElement('audio');

const imgCards = {
    naruto : "img/naruto.png",
    sakura : "img/sakura.png",
    chodji : "img/chodji.png",
    gaara : "img/gaara.png",
    hinata : "img/hinata.png",
    ino : "img/ino.png",
    // kankuro : "img/kankuro.png",
    // kiba : "img/kiba.png",
    // li : "img/li.png",
    // nedji : "img/nedji.png",
    // say : "img/say.png",
    // shikamaru : "img/shikamaru.png",
    // shino : "img/shino.png",
    // temari : "img/temari.png",
    // tenten : "img/tenten.png"
};

logo.classList.add('logo');
logo.src = "icons/Naruto-logo.png";
main.insertBefore(logo, main.firstElementChild);

audio.loop = true;
audio.innerHTML = `<source src="narutos-theme-song.mp3" type="audio/mpeg">`;
main.append(audio);

promo.classList.add('text');
promo.innerHTML = `<h1>Hello! You are in my game<br>"Naruto memory-pair game"</h1>
<p>This is a typical memory-pair game where you have to find pairs of cards. In order to win, you have to find all pairs of character cards.<br>Upbeat music is playing in the background, so turn your device down :)<br><br>Press start and good luck :)</p>`;

buttonStart.classList.add('button__start');
buttonStart.innerText = "START";
promo.append(buttonStart);
const container = document.querySelector('.container');
container.insertBefore(promo, container.firstChild);

buttonStart.addEventListener('click', () => {
    promo.classList.add('hide');
    drowCards();
    audio.play();
})

winImg.classList.add('win__img');
winImg.src = 'icons/win.png';
imgRestart.classList.add('restart__img');
imgRestart.src = 'icons/restart-icon.png';
textRestart.innerText = "RESTART"
textRestart.classList.add('restart__text', 'font_red_bold')
buttonRestart.classList.add('restart');
buttonRestart.append(imgRestart);
buttonRestart.append(textRestart);

winBlock.classList.add('text', 'win__block', 'hide');


function Shuffle(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};
    
const createArrCards = function () {
    const finalArrImgCard = [];
    let i = 1;
    while(i <= 2) {
        const arrImgCards = Object.values(imgCards);
        const arrAltcards = Object.keys(imgCards);
    
        for (let i = 0; i < arrAltcards.length; i++) {
            const itemArrCard = [];
            itemArrCard.push(arrImgCards[i]);
            itemArrCard.push(arrAltcards[i]);
            finalArrImgCard.push(itemArrCard);
        }
        Shuffle(finalArrImgCard);
        i++
    }
    return finalArrImgCard;
}
let arrCards = createArrCards()

function drowCards () {
    function arrayOutput () {
        for (var i=0;i<arrCards.length;i++) {
           playingField.insertAdjacentHTML('beforeend', createCard(arrCards[i][0], arrCards[i][1]));
        }
    }
    arrayOutput();
        
    function createCard (link, alt) {
        const card = `<div class="flip-container flip card">
        <div class="flipper">
            <div class="front">
                <img src="${link}" alt="${alt}" class="front__card">
            </div>
            <div class="back">
                <img src="img/back-cards.jpg" alt="card background" class="back__card">
            </div>
        </div>
    </div>`;
    return card;
    }
    setTimeout (flipBack, 2000);
}



let hasFlipCard = false;
let firstCard, secondCard, clickCounter = 0;

playingField.addEventListener('click', (e) => {
    clickCounter++;
    const target = e.target,
          flipper = findParrentAncestor(target, 'flip-container'),
          frontCard = findParrentAncestor(target, 'flipper');

    if(target.classList.contains('back__card') && (!firstCard || !secondCard)) {
        flipper.classList.add("flip");

        if(!hasFlipCard) {
            firstCard = findChildAncestor(frontCard, 'front__card');
            hasFlipCard = true;
            return;
        }
    
        secondCard = findChildAncestor(frontCard, 'front__card');
        hasFlipCard = false;
    
            if (firstCard !== secondCard) {
                checkMatch(firstCard, secondCard);
            }

        setTimeout( () => {
            flipBack();
            firstCard = '', secondCard = '';
        } ,1000);
    }
})

function checkMatch (firstCard, secondCard) {
    if (firstCard.alt === secondCard.alt) { 
        setTimeout (() => {
            findParrentAncestor(firstCard, 'flip-container').classList.add('opacity');
            findParrentAncestor(secondCard, 'flip-container').classList.add('opacity');
            checkWin();
        }, 500)
    };
}

function findParrentAncestor (el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

function findChildAncestor (el, cls) {
    while ((el = el.firstElementChild) && !el.classList.contains(cls));
    return el;
}

function flipBack () {
    const flipContainers = document.querySelectorAll('.flip-container');
    flipContainers.forEach(item => {
        item.classList.remove("flip");
    })
}

function checkWin () {
    const opacityCards = document.querySelectorAll('.opacity');
    if (opacityCards.length == arrCards.length) {
        setTimeout(() => {
            playingField.classList.add('hide');
            winBlock.classList.remove('hide');
        }, 1000)
        winBlock.insertBefore(winImg, winBlock.firstChild);
        winBlock.insertAdjacentHTML('beforeend', `<p>it took you <span class="font_red_bold">${clickCounter}</span> clicks to win<br><br>maybe next time will be better ;)</p>`);
        winBlock.append(buttonRestart);
        container.insertBefore(winBlock, container.firstChild);
        
    }
}

imgRestart.addEventListener('click', () => {
    winBlock.classList.add('hide');
    playingField.classList.remove('hide');
    playingField.innerHTML = '';
    arrCards = createArrCards();
    drowCards();
    
})



