document.addEventListener("DOMContentLoaded", () => {
    const encryptBtn = document.getElementById('encryptBtn');
    const decryptBtn = document.getElementById('decryptBtn');
    const passwordSection = document.getElementById('passwordSection');
    const genPassword = document.getElementById('genPassword');
    const statusSection = document.getElementById('statusSection');
    const statusText = document.getElementById('statusText');

    const cryptoEngine = new CipherForgeCrypto(); // Make sure crypto.js has this class

    encryptBtn.addEventListener('click', async () => {
        const selectedFile = window.getSelectedFile();
        if (!selectedFile) { alert("Select a file first!"); return; }

        const pwd = cryptoEngine.generatePassword();
        genPassword.value = pwd;
        passwordSection.classList.remove('hidden');

        try {
            const encBlob = await cryptoEngine.encryptFile(selectedFile, pwd);
            let safeName = selectedFile.name.replace(/\s+/g, "_").replace(/\(|\)/g, "");
            downloadBlob(encBlob, safeName + ".encrypted");
            statusText.textContent = "Encryption completed successfully!";
            statusSection.classList.remove('hidden');
        } catch (e) {
            alert("Encryption failed: " + e.message);
        }
    });

    decryptBtn.addEventListener('click', async () => {
        const selectedFile = window.getSelectedFile();
        if (!selectedFile) { alert("Select a file first!"); return; }

        const pwd = prompt("Enter password for decryption:");
        if (!pwd) return;

        try {
            const decBlob = await cryptoEngine.decryptFile(selectedFile, pwd);
            let originalName = selectedFile.name.replace(/\.encrypted$/, "");
            downloadBlob(decBlob, originalName);
            statusText.textContent = "Decryption completed successfully!";
            statusSection.classList.remove('hidden');
        } catch (e) {
            alert("Decryption failed. Wrong password or corrupted file.");
        }
    });

    function downloadBlob(blob, filename){
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
});
