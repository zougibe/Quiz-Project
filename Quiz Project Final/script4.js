import { Countdown } from "./countdown.js";

const nextButton = document.querySelector('.next');
const prevButton = document.querySelector('.back');
const submitButton = document.querySelector('.submit');
const flagButton = document.querySelector('.flaged');
const questionsW = document.querySelector('.questionsW');

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
fetch('back.json')
    .then(response => response.json())
    .then(data => {
        const questions = data[0].questions; 
        const middleSection = document.querySelector('.middle');
        const questionElement = middleSection.querySelector('h2');
        const choicesForm = middleSection.querySelector('.choices');


        shuffle(questions);

        let currentQuestionIndex = parseInt(localStorage.getItem('currentQuestionIndex')) || 0;
        let correctAnswers = parseInt(localStorage.getItem('correctAnswers')) || 0;
        let savedAnswers = JSON.parse(localStorage.getItem('savedAnswers')) || {};
        let flaggedQuestions = JSON.parse(localStorage.getItem('flaggedQuestions')) || [];

        function loadQuestion(index) {
            const question = questions[index];
            questionElement.textContent = question.question;
            choicesForm.innerHTML = '';

            question.choices.forEach(choice => {
                const label = document.createElement('label');
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = 'answer';
                input.value = choice;

                if (savedAnswers[index] === choice) {
                    input.checked = true;
                }

                input.addEventListener('change', () => {
                    savedAnswers[currentQuestionIndex] = choice;
                    localStorage.setItem('savedAnswers', JSON.stringify(savedAnswers));
                
                    correctAnswers = 0;
                    for (let index in savedAnswers) {
                        if (savedAnswers[index] === questions[index].correctAnswer) {
                            correctAnswers++;
                        }
                    }
                    localStorage.setItem('correctAnswers', correctAnswers);
                
                    const flagIndex = flaggedQuestions.indexOf(currentQuestionIndex);
                    if (flagIndex !== -1) {
                        flaggedQuestions.splice(flagIndex, 1);
                        localStorage.setItem('flaggedQuestions', JSON.stringify(flaggedQuestions));
                        updateFlaggedQuestionsUI();
                    }
                });
                

                label.appendChild(input);
                label.appendChild(document.createTextNode(choice));
                choicesForm.appendChild(label);
            });

            prevButton.style.cursor = currentQuestionIndex === 0 ? 'not-allowed' : 'pointer';
            nextButton.style.cursor = currentQuestionIndex === questions.length - 1 ? 'not-allowed' : 'pointer';
        }

        function updateFlaggedQuestionsUI() {
            questionsW.innerHTML = ''; 
            flaggedQuestions.forEach(index => {
                const button = document.createElement('button');
                button.textContent = `Question ${index + 1}`;
                button.className = 'flagged-question';
                button.addEventListener('click', () => {
                    currentQuestionIndex = index;
                    localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
                    loadQuestion(currentQuestionIndex);
                });
                questionsW.appendChild(button);
            });
        }

        loadQuestion(currentQuestionIndex);
        updateFlaggedQuestionsUI();

        nextButton.addEventListener('click', () => {
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
                loadQuestion(currentQuestionIndex);
            }
        });

        prevButton.addEventListener('click', () => {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
                loadQuestion(currentQuestionIndex);
            }
        });

        flagButton.addEventListener('click', () => {
            if (!flaggedQuestions.includes(currentQuestionIndex)) {
                flaggedQuestions.push(currentQuestionIndex);
                localStorage.setItem('flaggedQuestions', JSON.stringify(flaggedQuestions));
                updateFlaggedQuestionsUI();
            }
        });

        const warning = document.createElement('h2');
        const lower = document.querySelector('.lower');
        lower.append(warning);
        warning.style = 'color:red; font-size:1.3rem';
        warning.style.display = 'none';
        warning.textContent = 'Please answer ALL the questions first';

        submitButton.addEventListener('click', () => {
            const answeredCount = Object.keys(savedAnswers).length;

            if (answeredCount !== questions.length) {
                warning.style.display = 'block';
            } else {
                calculateResult();
                localStorage.removeItem('savedAnswers');
                localStorage.removeItem('currentQuestionIndex');
                localStorage.removeItem('correctAnswers');
                localStorage.removeItem('flaggedQuestions');
            }
        });

        function calculateResult() {
            const percentage = (correctAnswers / questions.length - 1) * 100;
            localStorage.setItem('percentage', percentage);
            if (percentage >= 60) {
                window.location.href = '6-success.html';
            } else {
                window.location.href = '7-failed.html';
            }
        }
    })
    .catch(error => console.error('Error fetching questions:', error));

const timer = new Countdown(15, '5-timeout.html');
timer.start();
