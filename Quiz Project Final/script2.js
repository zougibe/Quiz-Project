let mailC = document.querySelector(".mailC");
let passwordC = document.querySelector(".passwordC");
let btn = document.querySelector('button');
let err = document.querySelector('p');

let userArr = JSON.parse(localStorage.getItem("userArr") || "[]");

btn.addEventListener("click", validateE);

function validateE(e) {
    e.preventDefault();
    let user = userArr.find(user => user.email === mailC.value.toLowerCase() && user.password === passwordC.value);

    if (!user) {
        err.textContent = "The mail or the password is wrong";
    } else {
        err.textContent = "";
        localStorage.setItem("fname", user.fname);
        localStorage.setItem("lname", user.lname);

        window.location.href = "3-Startexam.html";
    }
}
