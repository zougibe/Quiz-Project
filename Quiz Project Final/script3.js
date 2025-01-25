const fname = localStorage.getItem('fname')
const lname = localStorage.getItem('lname')

document.querySelector('h2').textContent = `Welcome ${fname} ${lname}`

const startBtn = document.querySelector('button')

startBtn.addEventListener('click', () => {
    location.href = '4-exam.html'
})
