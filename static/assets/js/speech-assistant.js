
const assistant = document.querySelector(".emma-assistant");
const svg = document.getElementById('assembly');
const textarea = document.getElementById('Textarea');
const copyButton = document.getElementById('copyarea');
const speechButton = document.getElementById('speecharea');
const traductionButton = document.getElementById('traduction');
const csrfToken = document.getElementsByName("csrfmiddlewaretoken")[0].value;



let final_transcript = null;

function loadUIkit() {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/uikit/3.7.4/js/uikit.min.js';
    document.head.appendChild(script);
}


let speechRecognition = new webkitSpeechRecognition();

speechRecognition.continuous = true;
speechRecognition.interimResults = true;
speechRecognition.lang = 'fr-FR';




speechRecognition.onstart = () => {
    console.log("Speech Recognition start");
};
speechRecognition.onerror = () => {
    console.log("Speech Recognition Error");
};
speechRecognition.onend = () => {
    console.log("Speech Recognition Ended");
};

const commandActions = {
    thanks: () => {
        const message = "Je t'en prie! Si vous avez d'autres questions," +
            " n'hésitez pas à demander!";

        readOut(message);
        // Add your code here to execute the desired action for the "hello" command
    },
    objectif: () => {
        console.log("Play music command detected!");
        // Add your code here to execute the desired action for the "play music" command
    },
};

speechRecognition.onresult = (event) => {
    let interim_transcript = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
            // readOut(final_transcript);
            console.log(final_transcript);


            // Check if a specific command was spoken
            const command = event.results[i][0].transcript.toLowerCase();

            if (command.includes("merci")) {
                commandActions.thanks();
                speechRecognition.stop();
            }
            else {
                generateResponse(final_transcript);
            }
        } else {
            interim_transcript += event.results[i][0].transcript;
        }
    }
    final_transcript = "";
};

assistant.onclick = () => {
    readOut("Bonjour, je suis 'Emma'. Comment puis-je vous aider aujourd'hui?", () => {
        console.log("Speech synthesis completed");
        speechRecognition.start();
    });

};

function readOut(message, callback) {
    let speech = new SpeechSynthesisUtterance();
    speech.text = message;
    speech.volume = 1;

    let voices = window.speechSynthesis.getVoices();
    console.log("Available voices:");
    voices.forEach(voice => {
        console.log(voice.name);
    });


    // Find the voice you want to use
    // You can loop through the available voices and choose one based on its name or other properties
    let desiredVoice = voices.find(voice => voice.name === 'Google français');

    // Set the desired voice
    speech.voice = desiredVoice;

    speech.onend = () => {
        console.log("Speaking out");
        if (typeof callback === 'function') {
            callback();
        }
    };
    window.speechSynthesis.speak(speech);
    // console.log("speaking out");

}


function textArea(textToType) {
    // Clear the existing text in the textarea
    textarea.value = '';
    // Typing animation function
    function typeText(index) {
        if (index < textToType.length) {
            // Add one character at a time with a slight delay
            textarea.value += textToType.charAt(index);
            index++;
            setTimeout(function () {
                typeText(index);
            }, 30); // Adjust the typing speed (delay) as needed
        }
    }
    UIkit.modal('#create-chatbot-modal').show();
    typeText(0);

}

function generateResponse(text) {
    const data = {
        'text': text,
    };

    fetch('/gpt_outputv11/', {
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

                textArea(data.output);
            }

        })
        .catch(error => {
            console.error(error);
            return null;

        });
}

copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(textarea.value);
});


speechButton.addEventListener("click", () => {
    readOut(textarea.value);
});
