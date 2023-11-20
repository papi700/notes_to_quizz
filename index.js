//load the text-area
//Once the button 'create-flashcards' is hit, load flashcards 1 after another after removing the text area


import createTextArea from "./text-area.js";
import getAllQuestionStrings from "./flashcard.js";

const body = document.getElementsByTagName('body')[0]

const textArea = createTextArea()

body.appendChild(textArea)

const createButton = document.createElement('button')
createButton.innerHTML = "Create"

body.appendChild(createButton)

createButton.onclick = () => {
    // console.log(textArea.value)
    console.log(textArea.value.match(/^[0-9]+\.\s(.*?)(?=(?:\n[0-9]+\.|\n\s*Choices))/gs))
    // let rawText = textArea.value
    // body.removeChild(textArea)
    // createButton.innerHTML = "Correct"
    // const flashcards = getAllQuestionStrings(rawText)
    // console.log(flashcards)
    // if (typeof flashcards[0] != 'undefined') {
    //     console.log(flashcards[0])
    //     body.insertAdjacentElement("afterbegin", flashcards[0].render())
    // }
    // flashcards.forEach(flashcard => {
    //     body.insertAdjacentElement("afterbegin", flashcard.render())
    //     const validColor = '#A9DFBF'
    //     const invalidColor = '#CD6155'
    //     button.onclick = () => {
    //         flashcard.correct(validColor, invalidColor)
    //         button.innerHTML = "Next"
    //     }
    // })
}





