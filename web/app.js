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
  allowAutoPassword = true;

  document.getElementById("autoPassword").checked = false;
  document.getElementById("autoPassword").closest("label").classList.remove("hidden");
  document.getElementById("generatedBox").classList.add("hidden");

  show("screen-password");
};

document.getElementById("decryptBtn").onclick = () => {
  action = "decrypt";
  allowAutoPassword = false;

  const auto = document.getElementById("autoPassword");
  auto.checked = false;
  auto.closest("label").classList.add("hidden");

  document.getElementById("generatedBox").classList.add("hidden");

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

    const url = URL.createObjectURL(result);
    const a = document.createElement("a");

    a.href = url;
    a.download =
      action === "encrypt"
        ? selectedFile.name + ".encrypted"
        : selectedFile.name.replace(/\.encrypted$/, "");

    document.body.appendChild(a);
    a.click();

    URL.revokeObjectURL(url);
    a.remove();

    status.textContent = "✔ Completed";
  } catch {
    status.textContent = "❌ Wrong password or corrupted file";
  }
};

document.getElementById("backBtn").onclick = () => location.reload();
