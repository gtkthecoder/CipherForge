// Ensure DOM is loaded before attaching listeners
window.addEventListener('DOMContentLoaded', () => {

    // --- OVERLAY ACCEPT BUTTON ---
    const overlay = document.getElementById('overlay');
    const acceptBtn = document.getElementById('acceptBtn');
    const appDiv = document.getElementById('app');

    acceptBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
        appDiv.style.display = 'flex'; // show main app
    });

    // --- FILE SELECTION ---
    const fileDrop = document.getElementById('fileDrop');
    const fileInput = document.getElementById('fileInput');
    const selectedFileText = document.getElementById('selectedFile');

    let selectedFileObj = null;
    let userPassword = null;

    function handleFile(file) {
        selectedFileObj = file;
        selectedFileText.textContent = file.name;
        document.getElementById('passwordOptions').style.display = 'block';
        document.getElementById('encryptBtn').disabled = true;
        document.getElementById('decryptBtn').disabled = true;
    }

    // Drag & drop and click
    fileDrop.addEventListener('click', () => fileInput.click());
    fileDrop.addEventListener('dragover', e => {
        e.preventDefault();
        fileDrop.classList.add('hover');
    });
    fileDrop.addEventListener('dragleave', () => fileDrop.classList.remove('hover'));
    fileDrop.addEventListener('drop', e => {
        e.preventDefault();
        fileDrop.classList.remove('hover');
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener('change', e => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });

    // --- PASSWORD OPTIONS ---
    const ownPasswordBtn = document.getElementById('ownPasswordBtn');
    const genPasswordBtn = document.getElementById('genPasswordBtn');
    const genPassword = document.getElementById('genPassword');
    const copyPassword = document.getElementById('copyPassword');

    ownPasswordBtn.addEventListener('click', () => {
        let pwd = prompt("Enter your password (min 8 chars):");
        if (!pwd) return;
        if (pwd.length < 8 && !confirm("Password too short. Use anyway?")) return;
        let confirmPwd = prompt("Confirm password:");
        if (pwd !== confirmPwd) { alert("Passwords do not match!"); return; }
        userPassword = pwd;
        genPassword.value = userPassword;
        document.getElementById('encryptBtn').disabled = false;
        document.getElementById('decryptBtn').disabled = false;
    });

    genPasswordBtn.addEventListener('click', () => {
        // ~100 char strong password
        userPassword = window.cryptoEngine.generatePassword(100);
        genPassword.value = userPassword;
        document.getElementById('encryptBtn').disabled = false;
        document.getElementById('decryptBtn').disabled = false;
    });

    copyPassword.addEventListener('click', () => {
        if (!genPassword.value) return;
        navigator.clipboard.writeText(genPassword.value);
        alert("Password copied to clipboard!");
    });

    // --- EXPOSE FILE & PASSWORD ---
    window.getSelectedFile = () => selectedFileObj;
    window.getUserPassword = () => userPassword;

});
