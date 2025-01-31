let fname = document.querySelector(".fname");
let lname = document.querySelector(".lname");
let mail = document.querySelector(".mail");
let pass = document.querySelector(".pass");
let passC = document.querySelector(".passC");
let btn = document.querySelector("button");

fname.addEventListener("blur", validateFirstName);
lname.addEventListener("blur", validateLastName);
mail.addEventListener("blur", validateEmail);
pass.addEventListener("blur", validatePassword);
passC.addEventListener("blur", validateConfirmPassword);

function validateFirstName() {
    if (/\d/.test(fname.value)|| fname.value == "" || fname.value.length <= 3 ) {
        document.querySelector(".fnameE").textContent = "Only Characters and more than 2 Characters";
        fname.classList.add("apply-shake");
        return false;
    } else {
        document.querySelector(".fnameE").textContent = "";
        fname.classList.remove("apply-shake");
        return true;
    }
}

function validateLastName() {
    if (/\d/.test(lname.value)|| lname.value == "" || lname.value.length <= 3) {
        document.querySelector(".lnameE").textContent = "Only Characters and more than 2 Characters";
        lname.classList.add("apply-shake");
        return false;
    } else {
        document.querySelector(".lnameE").textContent = "";
        lname.classList.remove("apply-shake");
        return true;
    }
}

function isDuplicateEmail(email) {
    return userArr.some((user) => user.email === email);
}

function validateEmail() {
    let mailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!mailReg.test(mail.value)) {
        document.querySelector(".mailE").textContent = "Enter Valid Mail";
        mail.classList.add("apply-shake");
        return false;   
    }
    console.log(mail.value);
    
    if (isDuplicateEmail(mail.value.toLowerCase())) {
        console.log("Email already exists!");
        document.querySelector(".mailE").textContent = "Email already exists!";
        mail.classList.add("apply-shake");
        return false;
    } else {
        document.querySelector(".mailE").textContent = "";
        mail.classList.remove("apply-shake");
        return true;
    }
}

function validatePassword() {
    let passReg =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passReg.test(pass.value)) {
        document.querySelector(".passE").textContent =
            "Enter Valid Password Should contain more than 8 digits has a Capital letter , Small letter and a symbol";
        pass.classList.add("apply-shake");
        return false;
    } else {
        document.querySelector(".passE").textContent = "";
        pass.classList.remove("apply-shake");
        return true;
    }
}

function validateConfirmPassword() {
    if (pass.value != passC.value) {
        document.querySelector(".passCE").textContent = "Enter Matched Passwords";
        passC.classList.add("apply-shake");
        return false;
    } else {
        document.querySelector(".passCE").textContent = "";
        passC.classList.remove("apply-shake");
        return true;
    }
}

let userArr = JSON.parse(localStorage.getItem("userArr") || "[]");

btn.addEventListener("click", function (e) {
    e.preventDefault();
    const isValidFirstName = validateFirstName();
    const isValidLastName = validateLastName();
    const isValidEmail = validateEmail();
    const isValidPassword = validatePassword();
    const isValidConfirmPassword = validateConfirmPassword();
    if (
        isValidFirstName &&
        isValidLastName &&
        isValidEmail &&
        isValidPassword &&
        isValidConfirmPassword
    ) {
        const user = {
            email: mail.value.toLowerCase(),
            password: pass.value,
            fname: fname.value,
            lname: lname.value,
        };
        userArr.push(user);
        localStorage.setItem("userArr", JSON.stringify(userArr));
        window.location.replace("2-login.html");
    } else {
        console.log('Validation failed');
    }
});
