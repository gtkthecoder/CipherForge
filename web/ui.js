document.addEventListener("DOMContentLoaded", () => {

    const overlay = document.getElementById('overlay');
    const acceptBtn = document.getElementById('acceptBtn');
    const appDiv = document.getElementById('app');
    const fileDrop = document.getElementById('fileDrop');
    const fileInput = document.getElementById('fileInput');
    const selectedFileText = document.getElementById('selectedFile');

    const encryptBtn = document.getElementById('encryptBtn');
    const decryptBtn = document.getElementById('decryptBtn');
    const methodsBtn = document.getElementById('methodsBtn');

    const passwordSection = document.getElementById('passwordSection');
    const genPassword = document.getElementById('genPassword');
    const copyPassword = document.getElementById('copyPassword');

    const statusSection = document.getElementById('statusSection');
    const statusText = document.getElementById('statusText');
    const backToMenu = document.getElementById('backToMenu');

    let selectedFileObj = null;

    // Initially disable buttons until file selected
    encryptBtn.disabled = true;
    decryptBtn.disabled = true;

    // Accept Warning
    acceptBtn.addEventListener('click', () => {
        overlay.classList.add('hidden');
        appDiv.classList.remove('hidden');
    });

    // File selection
    fileDrop.addEventListener('click', () => fileInput.click());
    fileDrop.addEventListener('dragover', (e) => { e.preventDefault(); fileDrop.classList.add('hover'); });
    fileDrop.addEventListener('dragleave', () => { fileDrop.classList.remove('hover'); });
    fileDrop.addEventListener('drop', (e) => {
        e.preventDefault();
        fileDrop.classList.remove('hover');
        if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) handleFile(e.target.files[0]);
    });

    function handleFile(file){
        selectedFileObj = file;
        selectedFileText.textContent = file.name;
        encryptBtn.disabled = false;
        decryptBtn.disabled = false;
    }

    // Methods popup
    methodsBtn.addEventListener('click', () => {
        alert(
            "Encryption Methods Used:\n" +
            "1. AES-256-GCM\n" +
            "2. PBKDF2 with SHA-256 (100,000 iterations)\n" +
            "3. File size preserved\n" +
            "4. No password stored"
        );
    });

    // Copy password
    copyPassword.addEventListener('click', () => {
        if (!genPassword.value) return;
        navigator.clipboard.writeText(genPassword.value);
        alert("Copied to clipboard!");
    });

    // Back to main menu
    backToMenu.addEventListener('click', () => {
        statusSection.classList.add('hidden');
        passwordSection.classList.add('hidden');
        fileDrop.style.display = 'block';
        selectedFileText.textContent = selectedFileObj ? selectedFileObj.name : "No file selected";
    });

    // Expose file for app.js
    window.getSelectedFile = () => selectedFileObj;
});
