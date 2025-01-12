
var fileInput = document.querySelector(".file-input");
var uploadedArea = document.querySelector(".uploaded-area");
var nameFile = document.querySelector("#name-file");
var sizeFile = document.querySelector("#size-file");
var photoSlct = document.getElementById('photoSelect');

// console.log("start")
photoSlct.addEventListener("click", () => {
    console.log("clicked")
    fileInput.click();
});




fileInput.onchange = ({ target }) => {
    let file = target.files[0];
    if (file) {
        let fileName = file.name;
        if (fileName.length >= 12) {
            let splitName = fileName.split('.');
            fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
        }
        let fileSize = (file.size / 1024).toFixed(2) + " KB"; // Convert file size to kilobytes

        uploadedArea.classList.remove('hidden');
        nameFile.innerHTML = fileName;
        sizeFile.innerHTML = fileSize;
    }
}

