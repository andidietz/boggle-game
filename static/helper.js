const submitBtn = document.querySelector('#submit')
const startBtn = document.querySelector('.start')

const msgBoard = document.querySelector('.msg')
const scoreBoard = document.querySelector('.score')
const timerBoard = document.querySelector('.timer')

const wordInput = document.querySelector('#guess-input')


let score = 0
let time = 60
let countingDown = false

wordsFound = []

async function handleGuess(event) {
    event.preventDefault()
    const wordGuessed = wordInput.value

    if (wordsFound.indexOf(wordGuessed) === -1) {
        const url = 'http://127.0.0.1:5000/guess'
        const res = await axios.get(url, {params: {'guess': wordGuessed}})
        
        formResultMessage(res.data.result, wordGuessed)
    } else {
        displayMessage(`${wordGuessed} already used. Try again`)
    }

    if (countingDown === false) {
        const timerId = setInterval(displayTimer, 1000)
        setTimeout( () => timesUp(timerId), 60000)
        countingDown = true
    }

    wipeInput(wordInput)
}

function formResultMessage(result, word) {
    if (result === 'not-on-board') {
        displayMessage(`${word} is ${result}`)
    } else if (result === 'not-word') {
        displayMessage(`${word} is not a word in the dictionary`)
    } else {
        displayMessage(`${word} was found on the board`)
        keepScore(word)
        updateWordsFound(word)
    }
}

function updateWordsFound(word) {
    wordsFound.push(word)
    const usedWordsBank = document.querySelector('.words')

    const li = document.createElement('li')
    li.innerText = word
    usedWordsBank.append(li) 
}

function displayMessage(msg) {
    msgBoard.innerText = msg
}

async function keepScore(word) {
    score += word.length
    scoreBoard.innerText = `Score: ${score}`
}

async function finalScore() {
    const url = 'http://127.0.0.1:5000/score'
    const res = await axios.post(url, {'score': score})

    if (res.data.newScore) {
        displayMessage(`New High Score: ${score}`)
    } else {
        displayMessage(`Final Score: ${score}`)
    }

    scoreBoard.style.display = 'none'
}

function displayTimer() {
    time -= 1
    timerBoard.innerText = `Seconds remaining: ${time}`
}

function timesUp(timerId) {
    const form = document.querySelector('.boggle')
    const board = document.querySelector('.boggle-board')

    clearInterval(timerId)

    msgBoard.innerText = 'TimesUp'
    form.style.display = 'none'
    board.style.display = 'none'

    startBtn.style.display = 'block'

    finalScore()
}

function wipeInput(input) {
    input.value = ''
}

submitBtn.addEventListener('click', handleGuess)