const form = document.querySelector("form")
NameField = form.querySelector(".name-field")
firstNameInput = NameField.querySelector(".first-name")
lastNameInput = NameField.querySelector(".last-name")
emailField = form.querySelector(".email-field")
emailInput = emailField.querySelector(".email")
passwordField = form.querySelector(".create-password")
passwordInput = passwordField.querySelector(".password")
cPasswordField = form.querySelector(".confirm-password")
cPasswordInput = cPasswordField.querySelector(".cPassword")
const csrfToken = document.getElementsByName("csrfmiddlewaretoken")[0].value;

function isFormEmpty() {
    if (firstNameInput.value.trim() === "" ||
        lastNameInput.value.trim() === "" ||
        emailInput.value.trim() === "" ||
        passwordInput.value.trim() === "" ||
        cPasswordInput.value.trim() === "") {
        return true;
    } else {
        return false;
    }
}

// Name Validation
function checkName() {

    const namePattern = /^[a-zA-Z]{2,30}$/;
    if (!firstNameInput.value.match(namePattern) || !lastNameInput.value.match(namePattern)) {
        return NameField.classList.add("invalid"); //adding invalid class if password input value do not match with passPattern
    }
    NameField.classList.remove("invalid"); //removing invalid class if password input value matched with passPattern
    return true
}

// Email Validation
function checkEmail() {
    const emailPattern = /^[\w-\.]+@etu\.uae\.ac\.ma$/;
    if (!emailInput.value.match(emailPattern)) {
        emailInput.addEventListener("keyup", checkEmail);
        return emailField.classList.add("invalid"); //adding invalid class if email value do not matched
    }

    emailField.classList.remove("invalid") // removing invalid class if email value matched with emailPattern
    return true
}

// Hide and show password
const eyeIcons = document.querySelector('i[data-feather="eye-off"]');

eyeIcons.addEventListener("click", () => {
    const pInput = eyeIcons.parentElement.querySelector("input") // getting parent element of eye icon and selecting the password input
    console.log(pInput);
    if (pInput.type === "password") {

        eyeIcons.replace('data-feather', 'eye');
        return pInput.type = "text";
    }
    eyeIcons.replace('data-feather', 'eye-off');
    return pInput.type = "password";
});

// Password Validation
function createPass() {

    const passPattern =
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    if (!passwordInput.value.match(passPattern)) {
        return passwordField.classList.add("invalid"); //adding invalid class if password input value do not match with passPattern
    }
    passwordField.classList.remove("invalid"); //removing invalid class if password input value matched with passPattern
    return true
}

// Confirm Password Validtion
function confirmPass() {
    if (passwordInput.value !== cPasswordInput.value || cPasswordInput.value === "") {
        console.log("true");
        return cPasswordField.classList.add("invalid");
    }
    cPasswordField.classList.remove("invalid");
    return true
}

function sendData() {
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = cPasswordInput.value;

    // Check if the email address already exists in the database
    const data = {
        'email': email,
    };

    fetch('/check_email_exists', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            if (data.exists) {
                // Display an error message indicating that the email address is already in use
                const messageDiv = document.getElementById('message');
                messageDiv.innerHTML = 'This email address is already in use.';

                // Add a class to the email input field to highlight the error
                emailField.classList.add("invalid-email");
                emailInput.removeEventListener("keyup", checkEmail);

            } else {
                // Create an object with the user's data to send to the server
                const userData = {
                    'first_name': firstName,
                    'last_name': lastName,
                    'email': email,
                    'password': password,
                    'confirm_password': confirmPassword,
                };

                // Submit the user's data to the server
                fetch('/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                    },
                    body: JSON.stringify(userData),
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            // Redirect to login page
                            if (data.redirect_url) {
                                // After the user has signed up, redirect them to the login page
                                window.location.href = data.redirect_url;

                                // Replace the current history state with the login page URL
                                history.replaceState(null, '', data.redirect_url);
                            }
                        }

                    })
                    .catch(error => {
                        console.error(error);
                        alert('An error occurred while submitting the form.');
                    });

            }
        })
        .catch(error => {
            console.error(error);
            alert('An error occurred while checking if the email address already exists.');
        });
}


// function checkemailData() {
//     const firstName = firstNameInput.value;
//     const lastName = lastNameInput.value;
//     const email = emailInput.value;
//     const password = passwordInput.value;
//     const confirmPassword = cPasswordInput.value;

//     // Check if the email address already exists in the database
//     const data = {
//         'email': email,
//     };

//     fetch('/check_email_exists', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'X-CSRFToken': csrfToken,
//         },
//         body: JSON.stringify(data),
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (data.exists) {
//                 // Display an error message indicating that the email address is already in use
//                 const messageDiv = document.getElementById('message');
//                 messageDiv.innerHTML = 'This email address is already in use.';

//                 // Add a class to the email input field to highlight the error
//                 emailField.classList.add("invalid-email");
//                 emailInput.removeEventListener("keyup", checkEmail);

//             }
//         })
//         .catch(error => {
//             console.error(error);
//             alert('An error occurred while checking if the email address already exists.');
//         });
// }



// Calling Funtion on Form Sumbit
form.addEventListener("submit", (e) => {
    e.preventDefault(); // preventing form submitting
    const nameValid = checkName();
    const emailValid = checkEmail();
    const passValid = createPass();
    const cPassValid = confirmPass();


    // sendData();
    if (nameValid && emailValid && passValid && cPassValid) {
        sendData();
    }


    // calling function on key up
    firstNameInput.addEventListener("keyup", checkName);
    lastNameInput.addEventListener("keyup", checkName);
    passwordInput.addEventListener("keyup", createPass);
    cPasswordInput.addEventListener("keyup", confirmPass);
    // if (
    //     !emailField.classList.contains("invalid") &&
    //     !passwordInput.classList.contains("invalid") &&
    //     !cPasswordField.classList.contains("invalid")
    // ) {
    //     location.href = form.getAttribute("action");
    // }
});