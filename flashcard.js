const toDimensionalArray = list => {
    const splitRegex = /\s([a-d]\..*?)(?=\s[a-d]\.|\s*$)/g;
    const diensionalArray = []
    if (list) {
        list.forEach(str => {
        const newArray = str.split(splitRegex).filter(choice => choice.trim() !== '')
        diensionalArray.push(newArray)
        })
    }
    return diensionalArray
}

const getAllQuestionStrings = str => {
    const questionRegex = /\d+\.\s(.*?)(?=\sChoices:|$)/g   
    return str.match(questionRegex)
}

const getChoiceStringsArrays = str => {
    const choicesRegex = /(?<=Choices:) (.*?)(?=Answer:|\s*$)/gs 
    const choiceStringArrays = toDimensionalArray(str.match(choicesRegex))
    return choiceStringArrays
}

const getValidChoiceStringsArrays= str => {
    const answerRegex = /(?<=Answer:\s)(.*?)(?=\d+\.|\s*$)/gs;
    const answers = toDimensionalArray(str.match(answerRegex))
    const trimedAnswers = []
    answers.forEach(validChoiceStrings => trimedAnswers.push(validChoiceStrings.map(string => string.trimEnd())))
    return trimedAnswers
}

const flashcard = (number, question, choices) => {
    const id = `flashcard-${number}`
    return {
        number,
        question,
        choices,
        containerId: id,
        _isMultipleValidChoices: false,
        _isAnswered: false,

        get isMultipleValidChoices () {
            return  this.validChoiceStrings.length > 1
        },

        get isAnswered () {
            return this.choices.some(choice => choice.isSelected)
        },
        
        renderQuestion () {
            const questionElement = document.createElement('h2')
            questionElement.innerHTML = this.question
            return questionElement
        },

        renderChoices () {
            const choicesContainer = document.createElement('div')
            for (const choice of this.choices) {
                choicesContainer.appendChild(choice.render())
            }
            return choicesContainer
        },

        render () {
            const flashcardContainer = document.createElement('div')
            flashcardContainer.id = this.containerId
            flashcardContainer.appendChild(this.renderQuestion())
            flashcardContainer.appendChild(this.renderChoices())
            return flashcardContainer
        },

        renderErrorMessage (errorMessage) {
            const errorElement = document.createElement('p')
            errorElement.innerHTML = errorMessage
            document.getElementById(this.containerId).insertAdjacentElement('afterbegin', errorElement)
        },

        correct (validColor, invalidColor) {
            if (this.isAnswered) {
                this.choices.forEach(choice => {
                    if (choice.isValid) {
                        choice.highlight(validColor)
                    } else if (choice.isSelected) {
                        choice.highlight(invalidColor)
                    }
                })
            } else {
                this.renderErrorMessage("Please Select Answer")
            }
        }
        
    }
}

const choice = (str, flashcardNumber, inputType, isValid) => {
    const index = flashcardNumber + "." + str[0]
    return {
        str,
        flashcardNumber,
        inputType,
        isValid,
        inputId :  `input-${index}`,
        containerId : `choice-container-${index}`,
        _isSelected: false,

        get isSelected () {
            const input = document.getElementById(this.inputId)
            return input.checked ? true : false
        },

        render () {
            const inputName = `input-${this.flashcardNumber}`
            const container = document.createElement('div')
            container.id = this.containerId
            const input = document.createElement('input')
            input.type = this.inputType
            input.name = inputName
            input.id = this.inputId
            input.value = this.str
            const inputLabel = document.createElement('lablel')
            inputLabel.for = input.id
            inputLabel.innerHTML = this.str
            container.appendChild(input)
            container.appendChild(inputLabel)
            return container
        },

        highlight (color) {
            document.getElementById(this.containerId).style.backgroundColor = color
        },
    }
}

const createChoices = (choiceStrings, flashcardNumber, validChoiceStrings) => {
    const choices = []
    choiceStrings.forEach(choiceString => {
        const str = choiceString
        const inputType = validChoiceStrings.length > 1 ? "checkbox" : "radio"
        const isValid = validChoiceStrings.includes(choiceString) ? true : false
        choices.push(choice(str, flashcardNumber, inputType, isValid))
    })
   return choices
}

const createFlashCards = rawText => {
    // const rawText = document.getElementById("raw-flashcards").value
    rawText = rawText.replace(/\n/g, "")
    const flashcards = []
    const questions = getAllQuestionStrings(rawText)
    const allChoiceStrings = getChoiceStringsArrays(rawText)
    const allValidChoiceStrings = getValidChoiceStringsArrays(rawText)
    if (questions != null) {
        for (let i = 0; i < questions.length; i++ ) {
            const flashcardNumber = i+1
            const question = questions[i]
            const choiceStrings = allChoiceStrings[i]
            const validChoiceStrings = allValidChoiceStrings[i]
            const choices = createChoices(choiceStrings, flashcardNumber, validChoiceStrings)
            flashcards.push(flashcard(flashcardNumber, question, choices))
        }
    }
    return flashcards
}

// const loadFlashcards = (flashcards) => {
//     flashcards.forEach(flashcard => document.getElementById('flashcards').appendChild(flashcard.render()))
//     const submissionButton = document.createElement('button')
//     submissionButton.id = "submission"
//     submissionButton.innerHTML = "Okay"
//     document.getElementById('flashcards').insertAdjacentElement('beforeend', submissionButton)
// }

// const correctFlashcards = (flashcards) => {
//     if (flashcards.every(flashcard => flashcard.isAnswered)) {
//         const validColor = '#A9DFBF'
//         const invalidColor = '#CD6155'
//         flashcards.forEach(flashcard => flashcard.correct(validColor, invalidColor))
//     } else {
//         const errorMessage = document.createElement('p')
//         errorMessage.innerHTML = "Please answer all the questions"
//         document.getElementById('flashcards').insertAdjacentElement('afterbegin', errorMessage)
//     }
// }

// document.getElementById('create-flashcards').onclick = () => {  
//     const flashcards = createFlashCards()
//     loadFlashcards(flashcards) 
//     document.getElementById('submission').onclick = () => {
//         correctFlashcards(flashcards)
//     }
// }

export default createFlashCards