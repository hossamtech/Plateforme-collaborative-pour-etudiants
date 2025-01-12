const quoteText = document.querySelector(".quote")
const quoteBtn = document.getElementById("new-quote")
const authorName = document.querySelector(".name")
const speechBtn = document.querySelector(".speech")
const copyBtn = document.querySelector(".copy")
const loveBtn = document.querySelector(".heart")
const synth = speechSynthesis;

function randomQuote() {

    console.log("start")
    quoteBtn.classList.add("loading");
    quoteBtn.innerText = "Chargement...";
    fetch("http://api.quotable.io/random").then(response => response.json()).then(result => {
        quoteText.innerText = result.content;
        authorName.innerText = result.author;
        quoteBtn.classList.remove("loading");
        quoteBtn.innerText = "Nouveau devis";
    });
}

// speechBtn.addEventListener("click", () => {
//     if (!quoteBtn.classList.contains("loading")) {
//         var getvoices = window.speechSynthesis.getVoices();

//         let utterance = new SpeechSynthesisUtterance(`${quoteText.innerText} by ${authorName.innerText}`);
//         utterance.rate = 0.9;
//         utterance.voice = window.speechSynthesis.getVoices()[8];

//         synth.speak(utterance);
//         setInterval(() => {
//             !synth.speaking ? speechBtn.classList.remove("active") : speechBtn.classList.add("active");
//         }, 10);
//     }
// });

speechBtn.addEventListener("click", () => {

    let speech = new SpeechSynthesisUtterance(`${quoteText.innerText} by ${authorName.innerText}`);
    speech.volume = 1;

    let voices = window.speechSynthesis.getVoices();


    // Find the voice you want to use
    // You can loop through the available voices and choose one based on its name or other properties
    let desiredVoice = voices.find(voice => voice.name === 'Google français');

    // Set the desired voice
    speech.voice = desiredVoice;


    window.speechSynthesis.speak(speech);
    // console.log("speaking out");

});


copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(quoteText.innerText);
});

loveBtn.addEventListener("click", () => {
    console.log("strat");
    loveBtn.classList.add("heart-clicked");
    // setTimeout(() => {
    //     button.classList.remove("animate");
    //   }, 600);
});



quoteBtn.addEventListener("click", randomQuote);