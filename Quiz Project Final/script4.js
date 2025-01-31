import { Countdown } from "./countdown.js";

const nextButton = document.querySelector('.next');
const prevButton = document.querySelector('.back');
const submitButton = document.querySelector('.submit');
const flagButton = document.querySelector('.flaged');
const questionsW = document.querySelector('.questionsW');
const middleSection = document.querySelector('.middle');
const questionElement = middleSection.querySelector('h2');
const choicesForm = middleSection.querySelector('.choices');
const counter = document.querySelector('.head .Qnum')


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
        console.log(questions);
        console.log(questions[0].choices[0]);

        shuffle(questions);

        let currentQuestionIndex = parseInt(localStorage.getItem('currentQuestionIndex')) || 0;
        console.log(currentQuestionIndex);

        let correctAnswers = parseInt(localStorage.getItem('correctAnswers')) || 0;
        let savedAnswers = JSON.parse(localStorage.getItem('savedAnswers')) || {};
        let flaggedQuestions = JSON.parse(localStorage.getItem('flaggedQuestions')) || [];

        function loadQuestion(index) {
            const question = questions[index];
            questionElement.textContent = question.question;
            choicesForm.innerHTML = '';
            const labels = [];

            question.choices.forEach(choice => {
                const label = document.createElement('label');
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = 'answer';
                input.value = choice;

                if (savedAnswers[index] === choice) {
                    input.checked = true;
                    label.style.background = '#e65d51';
                    label.style.color = 'white';
                }

                input.addEventListener('change', () => {
                    savedAnswers[currentQuestionIndex] = choice;
                    localStorage.setItem('savedAnswers', JSON.stringify(savedAnswers));

                    correctAnswers = 0;
                    for (let i in savedAnswers) {
                        if (savedAnswers[i] === questions[i].correctAnswer) {
                            correctAnswers++;
                        }
                    }
                    localStorage.setItem('correctAnswers', correctAnswers);

                    labels.forEach(label => {
                        label.style.background = 'transparent';
                        label.style.color = 'white';
                    });


                    if (input.checked) {
                        label.style.background = '#e65d51';
                        label.style.color = 'white';
                    }
                });

                label.appendChild(input);
                label.appendChild(document.createTextNode(choice));
                choicesForm.appendChild(label);
                labels.push(label);
            });

            prevButton.style.visibility = currentQuestionIndex === 0 ? 'hidden' : 'visible';
            nextButton.style.visibility = currentQuestionIndex === questions.length - 1 ? 'hidden' : 'visible';

            if (flaggedQuestions.includes(currentQuestionIndex)) {
                flagButton.style.color = '#3a2d38';
                flagButton.style.backgroundColor = 'white';
            } else {
                flagButton.style.color = 'white';
                flagButton.style.backgroundColor = '#3a2d38';
            }

            questionNumber();
        }


        function updateFlaggedQuestions() {
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
        updateFlaggedQuestions();

        nextButton.addEventListener('click', () => {
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
                loadQuestion(currentQuestionIndex);
                console.log(currentQuestionIndex);

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
                flagButton.style.color = '#3a2d38';
                flagButton.style.backgroundColor = 'white';
            } else {
                flaggedQuestions = flaggedQuestions.filter(index => index !== currentQuestionIndex);
                flagButton.style.color = 'white';
                flagButton.style.backgroundColor = '#3a2d38';
            }
            localStorage.setItem('flaggedQuestions', JSON.stringify(flaggedQuestions));
            updateFlaggedQuestions();
        });
        // console.log((flaggedQuestions.includes(currentQuestionIndex)));
        //         const warning = document.createElement('h2');
        //         const lower = document.querySelector('.lower');
        //         lower.append(warning);
        //         warning.style = 'color:red; font-size:1.3rem';
        //         warning.style.display = 'none';
        //         warning.textContent = 'Please answer ALL the questions first';

        submitButton.addEventListener('click', () => {
            // const answeredCount = Object.keys(savedAnswers).length;

            // if (answeredCount !== questions.length) {
            //     warning.style.display = 'block';
            // } else {
            calculateResult();
            localStorage.removeItem('savedAnswers');
            localStorage.removeItem('currentQuestionIndex');
            localStorage.removeItem('correctAnswers');
            localStorage.removeItem('flaggedQuestions');
            // }
        });

        function calculateResult() {
            const percentage = Math.ceil((correctAnswers / questions.length) * 100);
            localStorage.setItem('percentage', percentage);

            const stars = getStarRating(percentage);
            localStorage.setItem('stars', stars);

            if (percentage >= 60) {
                window.location.replace('6-success.html');
            } else {
                window.location.replace('7-failed.html');
            }
        }

        function getStarRating(percentage) {
            let starCount = Math.round((percentage / 100) * 5);
            let filledStars = '★'.repeat(starCount);
            let emptyStars = '☆'.repeat(5 - starCount);
            return filledStars + emptyStars;
        }
        function questionNumber() {
            let numb = parseInt(localStorage.getItem('currentQuestionIndex')) || 0;
            counter.textContent = `${numb + 1} of ${questions.length}`
        }
    })
    .catch(error => console.error('Error fetching questions:', error));

const timer = new Countdown(5, '5-timeout.html');
timer.start();
