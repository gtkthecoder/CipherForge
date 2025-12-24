// UI handling
const overlay = document.getElementById('overlay');
const acceptBtn = document.getElementById('acceptBtn');
const appDiv = document.getElementById('app');
const fileDrop = document.getElementById('fileDrop');
const fileInput = document.getElementById('fileInput');
const selectedFile = document.getElementById('selectedFile');
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
const cryptoEngine = new CipherForgeCrypto();

acceptBtn.addEventListener('click',()=>{
  overlay.classList.add('hidden');
  appDiv.classList.remove('hidden');
});

// Drag & Drop
fileDrop.addEventListener('click',()=>fileInput.click());
fileDrop.addEventListener('dragover',(e)=>{ e.preventDefault(); fileDrop.classList.add('hover'); });
fileDrop.addEventListener('dragleave',(e)=>{ fileDrop.classList.remove('hover'); });
fileDrop.addEventListener('drop',(e)=>{
  e.preventDefault(); fileDrop.classList.remove('hover');
  if(e.dataTransfer.files.length>0){ fileInput.files=e.dataTransfer.files; handleFile(e.dataTransfer.files[0]); }
});

fileInput.addEventListener('change',(e)=>{
  if(e.target.files.length>0) handleFile(e.target.files[0]);
});

function handleFile(file){
  selectedFileObj = file;
  selectedFile.textContent = file.name;
}

// Methods popup
methodsBtn.addEventListener('click',()=>{
  alert("Encryption Methods:\n1. AES-256-GCM\n2. PBKDF2 with SHA-256 (100,000 iterations)\n3. File size preserved\n4. No password storage");
});

// Password copy
copyPassword.addEventListener('click',()=>{
  navigator.clipboard.writeText(genPassword.value);
  alert("Copied to clipboard!");
});

// Back to menu
backToMenu.addEventListener('click',()=>{
  statusSection.classList.add('hidden');
  passwordSection.classList.add('hidden');
  fileDrop.style.display='block';
});
