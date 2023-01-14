let deck = []
let dealerSum = 0
let playerSum = 0
let hiddenValue = 0
let canhit = true
let dealerAceCount = 0
let playerAceCount = 0
var hidden

window.onload = () => {
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    //let values = ["A", "2", "3", "4"];
    let types = ["C", "D", "H", "S"];

    for(let i = 0; i < types.length; i++) {
        for(let j = 0; j < values.length; j++) {
            deck.push(values[j] + '-' + types[i])
        }
    }
}

function shuffleDeck() {
    for(let i = 0; i < deck.length; i++) {
        const randomDeck = Math.floor(Math.random() * deck.length)
        const temp = deck[i]
        deck[i] = deck[randomDeck]
        deck[randomDeck] = temp
    }
}

function startGame() {
    hidden = deck.pop()
    dealerSum += getValue(hidden)
    dealerAceCount += checkAce(hidden)

    while(dealerSum < 17) {
        const card = deck.pop()
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card)
        const cardImg = document.createElement('img')
        cardImg.src = './cards/' + card + '.png'
        document.getElementById('dealer-cards').append(cardImg)
    }

    for(let i = 0; i < 2; i++) {
        const playerCard = deck.pop()
        playerSum += getValue(playerCard);
        playerAceCount += checkAce(playerCard)
        const playerCardImg = document.createElement('img')
        playerCardImg.src = './cards/' + playerCard + '.png'
        document.getElementById('your-cards').append(playerCardImg)
    }

    document.getElementById('hit').addEventListener('click', hitCard)
    document.getElementById('stay').addEventListener('click', StayCard)
}

function getValue(card) {
    let value = card.split('-')[0]

    if(isNaN(value)) {
        if( value === 'A') {
            return 11
        } 
        return 10
    } else {
        return parseInt(value)
    }
}

function hitCard() {
    if(!canhit) {
        return
    }
    const hitCard = deck.pop()
    playerSum += getValue(hitCard);
    const playerCardImg = document.createElement('img')
    playerCardImg.src = './cards/' + hitCard + '.png'
    document.getElementById('your-cards').append(playerCardImg)

    if (reduceAce(playerSum, playerAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
        canhit = false;
    }
}

function StayCard() {

    dealerSum = reduceAce(dealerSum, dealerAceCount)
    playerSum = reduceAce(playerSum, playerAceCount)

    canhit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";

    let message = ''
    if(playerSum > 21) {
        message = 'Dealer win'
    } else if(dealerSum > 21) {
        message = 'You win'
    } else if(playerSum === dealerSum) {
        message = 'Tie' 
    } else if(playerSum > dealerSum) {
        message = 'You win' 
    } else if(dealerSum > playerSum) {
        message = 'Dealer win' 
    }
    document.getElementById('dealer-sum').innerText = dealerSum
    document.getElementById('your-sum').innerText = playerSum
    document.getElementById('results').innerText = message
}

function checkAce(card) {
    let value = card.split('-')[0]

    if(value === 'A') {
        return 1
    }
    return 0
}

function reduceAce(playerSum , aceCount) {
    while(playerSum > 21 && aceCount > 0) {
        playerSum -= 10
        aceCount--
    }
    return playerSum
}