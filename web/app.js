let selectedFile = null;
let action = null;

/* ===============================
   SCREEN CONTROL
================================ */
function show(id) {
  document.querySelectorAll(".screen")
    .forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

document.getElementById("acceptBtn").onclick = () => {
  show("screen-file");
};

/* ===============================
   FILE PICKING
================================ */
const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");

document.body.ondragover = e => e.preventDefault();
document.body.ondrop = e => {
  e.preventDefault();
  selectedFile = e.dataTransfer.files[0];
  show("screen-action");
};

dropZone.onclick = () => fileInput.click();

fileInput.onchange = () => {
  selectedFile = fileInput.files[0];
  show("screen-action");
};

/* ===============================
   ACTION SELECT
================================ */
const autoPassword = document.getElementById("autoPassword");
const genBox = document.getElementById("generatedBox");

document.getElementById("encryptBtn").onclick = () => {
  action = "encrypt";
  show("screen-password");

  // enable generator
  if (autoPassword) {
    autoPassword.checked = false;
    autoPassword.disabled = false;
    autoPassword.closest("label").classList.remove("hidden");
  }
  if (genBox) genBox.classList.add("hidden");
};

document.getElementById("decryptBtn").onclick = () => {
  action = "decrypt";
  show("screen-password");

  // HARD disable generator
  if (autoPassword) {
    autoPassword.checked = false;
    autoPassword.disabled = true;
    autoPassword.closest("label").classList.add("hidden");
  }
  if (genBox) genBox.classList.add("hidden");
};

/* ===============================
   PROCEED
================================ */
document.getElementById("proceedBtn").onclick = async () => {
  const pwdInput = document.getElementById("passwordInput");
  const password = pwdInput.value;

  if (!password) {
    alert("Password required");
    return;
  }

  show("screen-status");
  const status = document.getElementById("statusText");
  status.textContent =
    action === "encrypt" ? "Encrypting..." : "Decrypting...";

  try {
    let blob;

    if (action === "encrypt") {
      const buffer = await selectedFile.arrayBuffer();
      const encrypted = await encryptData(buffer, password);
      blob = new Blob([encrypted], { type: "application/octet-stream" });
    } else {
      const decrypted = await decryptData(selectedFile, password);
      blob = new Blob([decrypted], { type: "application/octet-stream" });
    }

    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);

    a.href = url;
    a.download =
      action === "encrypt"
        ? selectedFile.name + ".encrypted"
        : selectedFile.name.replace(/\.encrypted$/, "");

    document.body.appendChild(a);
    a.click();

    URL.revokeObjectURL(url);
    a.remove();

    status.textContent = "✅ Completed";
  } catch (e) {
    console.error(e);
    status.textContent = "❌ Wrong password or corrupted file";
  }
};

/* ===============================
   RESET
================================ */
document.getElementById("backBtn").onclick = () => {
  location.reload();
};
