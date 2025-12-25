let selectedFile, action;

const show = id => {
  document.querySelectorAll(".screen").forEach(s =>
    s.classList.add("hidden")
  );
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

  const auto = document.getElementById("autoPassword");
  const genBox = document.getElementById("generatedBox");
  if (auto) auto.checked = false;
  if (genBox) genBox.classList.add("hidden");
};

document.getElementById("proceedBtn").onclick = async () => {
  const pwd = document.getElementById("passwordInput").value;
  if (!pwd) return alert("Password required");

  show("screen-status");
  const status = document.getElementById("statusText");
  status.textContent =
    action === "encrypt" ? "Encrypting..." : "Decrypting...";

  try {
    let blob;

    if (action === "encrypt") {
      blob = await encryptData(
        await selectedFile.arrayBuffer(),
        pwd
      );
    } else {
      const decrypted = await decryptData(selectedFile, pwd);
      blob = new Blob([decrypted], {
        type: "application/octet-stream"
      });
    }

    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);

    let name;
    if (action === "encrypt") {
      name = selectedFile.name + ".encrypted";
    } else {
      name = selectedFile.name.endsWith(".encrypted")
        ? selectedFile.name.slice(0, -10)
        : selectedFile.name;
    }

    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();

    URL.revokeObjectURL(url);
    a.remove();

    status.textContent = "✔ Completed";
  } catch (err) {
    console.error(err);
    status.textContent = "❌ Wrong password or corrupted file";
  }
};

document.getElementById("backBtn").onclick = () => location.reload();
