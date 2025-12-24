let selectedFile, action;

const show = id => {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
};

document.getElementById("acceptBtn").onclick = () => show("screen-file");

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

document.getElementById("encryptBtn").onclick = () => {
  action = "encrypt";
  show("screen-password");
};

document.getElementById("decryptBtn").onclick = () => {
  action = "decrypt";
  show("screen-password");
};

document.getElementById("proceedBtn").onclick = async () => {
  const pwd = document.getElementById("passwordInput").value;
  if (!pwd) return alert("Password required");

  show("screen-status");
  const status = document.getElementById("statusText");
  status.textContent = action === "encrypt" ? "Encrypting..." : "Decrypting...";

  try {
    let result;
    if (action === "encrypt") {
      result = await encryptData(await selectedFile.arrayBuffer(), pwd);
    } else {
      const data = await decryptData(selectedFile, pwd);
      result = new Blob([data]);
    }

    const a = document.createElement("a");
    a.href = URL.createObjectURL(result);
    a.download =
      action === "encrypt"
        ? selectedFile.name + ".encrypted"
        : selectedFile.name.replace(".encrypted", "");
    a.click();

    status.textContent = "✔ Completed";
  } catch {
    status.textContent = "❌ Wrong password or corrupted file";
  }
};

document.getElementById("backBtn").onclick = () => location.reload();
