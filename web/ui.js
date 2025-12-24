window.addEventListener('DOMContentLoaded', () => {

    const overlay = document.getElementById('overlay');
    const acceptBtn = document.getElementById('acceptBtn');
    const appDiv = document.getElementById('app');

    const fileDrop = document.getElementById('fileDrop');
    const fileInput = document.getElementById('fileInput');
    const selectedFileText = document.getElementById('selectedFile');

    const stepAction = document.getElementById('stepAction');
    const encryptBtn = document.getElementById('encryptBtn');
    const decryptBtn = document.getElementById('decryptBtn');

    const passwordOptions = document.getElementById('passwordOptions');
    const ownPasswordBtn = document.getElementById('ownPasswordBtn');
    const genPasswordBtn = document.getElementById('genPasswordBtn');
    const genPassword = document.getElementById('genPassword');
    const copyPassword = document.getElementById('copyPassword');

    const statusSection = document.getElementById('statusSection');
    const backToMenu = document.getElementById('backToMenu');

    let selectedFileObj = null;
    let userPassword = null;

    // --- ACCEPT BUTTON ---
    acceptBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
        appDiv.style.display = 'flex';
    });

    // --- FILE SELECTION ---
    function handleFile(file) {
        selectedFileObj = file;
        selectedFileText.textContent = file.name;
        stepAction.classList.remove('hidden');
    }

    fileDrop.addEventListener('click', () => fileInput.click());
    fileDrop.addEventListener('dragover', e => { e.preventDefault(); fileDrop.classList.add('hover'); });
    fileDrop.addEventListener('dragleave', () => fileDrop.classList.remove('hover'));
    fileDrop.addEventListener('drop', e => { 
        e.preventDefault(); 
        fileDrop.classList.remove('hover'); 
        if(e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]); 
    });
    fileInput.addEventListener('change', e => { if(e.target.files.length) handleFile(e.target.files[0]); });

    // --- PASSWORD OPTIONS ---
    ownPasswordBtn.addEventListener('click', () => {
        let pwd = prompt("Enter your password (min 8 chars):");
        if(!pwd) return;
        if(pwd.length < 8 && !confirm("Password too short, use anyway?")) return;
        let confirmPwd = prompt("Confirm password:");
        if(pwd !== confirmPwd){ alert("Passwords do not match!"); return; }
        userPassword = pwd;
        genPassword.value = userPassword;
        encryptBtn.disabled = false;
        decryptBtn.disabled = false;
    });

    genPasswordBtn.addEventListener('click', () => {
        userPassword = window.cryptoEngine.generatePassword(100);
        genPassword.value = userPassword;
        encryptBtn.disabled = false;
        decryptBtn.disabled = false;
    });

    copyPassword.addEventListener('click', () => {
        if(!genPassword.value) return;
        navigator.clipboard.writeText(genPassword.value);
        alert("Password copied!");
    });

    // --- EXPOSE FILE & PASSWORD ---
    window.getSelectedFile = () => selectedFileObj;
    window.getUserPassword = () => userPassword;

});
