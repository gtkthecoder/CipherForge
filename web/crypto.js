const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Generate a cryptographically strong random salt
function generateSalt() {
  return crypto.getRandomValues(new Uint8Array(16));
}

// Generate a cryptographically strong random IV (12 bytes for GCM)
function generateIV() {
  return crypto.getRandomValues(new Uint8Array(12));
}

// Derive AES key from password using PBKDF2 + SHA-256
async function deriveKey(password, salt) {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

// Encrypt ArrayBuffer data
export async function encryptData(buffer, password) {
  const salt = generateSalt();
  const iv = generateIV();
  const key = await deriveKey(password, salt);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    buffer
  );

  // Output format: [salt][iv][ciphertext]
  const result = new Uint8Array(salt.byteLength + iv.byteLength + encrypted.byteLength);
  result.set(salt, 0);
  result.set(iv, salt.byteLength);
  result.set(new Uint8Array(encrypted), salt.byteLength + iv.byteLength);
  return result;
}

// Decrypt ArrayBuffer or File
export async function decryptData(file, password) {
  const arrayBuffer = await file.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);

  const salt = data.slice(0, 16);
  const iv = data.slice(16, 28);
  const ciphertext = data.slice(28);

  const key = await deriveKey(password, salt);

  try {
    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv },
      key,
      ciphertext
    );
    return new Uint8Array(decrypted);
  } catch {
    throw new Error("Wrong password or corrupted file");
  }
}

