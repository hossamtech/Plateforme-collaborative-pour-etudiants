const form = document.querySelector("form")
emailField = form.querySelector(".email-field")
emailInput = emailField.querySelector(".email")
passwordField = form.querySelector(".create-password")
passwordInput = passwordField.querySelector(".password")
const rememberCheckbox = document.querySelector('#remember-checkbox').checked;


const csrfToken = document.getElementsByName("csrfmiddlewaretoken")[0].value;



// Email Validation
function checkValidEmail() {
    const emailPattern = /^[\w-\.]+@etu\.uae\.ac\.ma$/;
    if (!emailInput.value.match(emailPattern)) {

        const messageDiv = document.getElementById('email-message');
        messageDiv.innerHTML = 'Please enter a valid email with @etu.uae.ac.ma domain.';

        // Add a class to the email input field to highlight the error
        emailField.classList.add("invalid");
        // emailInput.removeEventListener("keyup", checkEmail);
        // emailField.classList.add("invalid"); //adding invalid class if email value do not matched
        return true;
    }

    emailField.classList.remove("invalid") // removing invalid class if email value matched with emailPattern
    return false;
}

// // Hide and show password
// const eyeIcons = document.querySelector('i[data-feather="eye-off"]');

// eyeIcons.addEventListener("click", () => {
//     const pInput = eyeIcons.parentElement.querySelector("input");
//     console.log(pInput);
//     if (pInput.type === "password") {
//         eyeIcons.setAttribute('data-feather', 'eye');
//         pInput.type = "text";
//     } else {
//         eyeIcons.setAttribute('data-feather', 'eye-off');
//         pInput.type = "password";
//     }
// });


const icon = document.querySelector('.input-icon');
icon.addEventListener('click', function () {
    console.log("succseful")
    const icon = document.querySelector('.input-icon');
    if (icon.getAttribute('data-feather') === 'eye-off') {
        icon.setAttribute('data-feather', 'eye');
    } else {
        icon.setAttribute('data-feather', 'eye-off');
    }
});


// Check if the email address already exists in the database
function checkEmail() {

    const email = emailInput.value;

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
            if (!data.exists) {
                // Display an error message indicating that the email address is already in use
                const messageDiv = document.getElementById('email-message');
                messageDiv.innerHTML = "L'adresse e-mail que vous avez fournie n'est pas associée à un compte existant.";

                // Add a class to the email input field to highlight the error
                return emailField.classList.add("invalid");

            }
            else {
                return checkPassword();
            }

        })
        .catch(error => {
            console.error(error);
            alert('An error occurred while checking if the email address already exists.');
        });
}

function checkPassword() {

    const email = emailInput.value;
    const password = passwordInput.value;

    if (password.trim() === '') {
        // Display an error message indicating that the email address is already in use
        const messageDiv = document.getElementById('password-message');
        messageDiv.innerHTML = 'Password required.';

        // Add a class to the email input field to highlight the error
        return passwordField.classList.add("invalid");
    }

    const data = {
        'email': email,
        'password': password,
    };

    fetch('/check_password', {
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
                const messageDiv = document.getElementById('password-message');
                messageDiv.innerHTML = 'Le mot de passe que vous avez entré est incorrect.';

                // Add a class to the email input field to highlight the error
                return passwordField.classList.add("invalid");

            } else {
                // Create an object with the user's data to send to the server
                const data = {
                    'email': email,
                    'password': password,
                    'remember': rememberCheckbox,
                };

                // Submit the user's data to the server
                fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                    },
                    body: JSON.stringify(data),
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
            alert('An error occurred while checking if the password is correct');
        });
}

// Calling Funtion on Form Sumbit
form.addEventListener("submit", (e) => {

    e.preventDefault(); // preventing form submitting
    console.log(rememberCheckbox.checked)
    const emailValid = checkValidEmail();
    // console.log(emailValid);

    if (!emailValid) {
        checkEmail();
    }

    emailInput.addEventListener("keyup", checkValidEmail);
});
