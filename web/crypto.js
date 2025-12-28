const encoder = new TextEncoder();

/* ===============================
   KEY DERIVATION (PBKDF2)
================================ */
async function deriveKey(password, salt) {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
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
    baseKey,
    {
      name: "AES-GCM",
      length: 256
    },
    false,
    ["encrypt", "decrypt"]
  );
}

/* ===============================
   ENCRYPT (AES-256-GCM)
================================ */
async function encryptData(buffer, password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv   = crypto.getRandomValues(new Uint8Array(12));
  const key  = await deriveKey(password, salt);

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    buffer
  );

  // FORMAT:
  // [16 bytes salt][12 bytes iv][ciphertext+tag]
  const out = new Uint8Array(
    16 + 12 + ciphertext.byteLength
  );

  out.set(salt, 0);
  out.set(iv, 16);
  out.set(new Uint8Array(ciphertext), 28);

  return out.buffer;
}

/* ===============================
   DECRYPT (AES-256-GCM)
================================ */
async function decryptData(file, password) {
  const data = new Uint8Array(await file.arrayBuffer());

  const salt = data.slice(0, 16);
  const iv   = data.slice(16, 28);
  const enc  = data.slice(28);

  const key = await deriveKey(password, salt);

  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    enc
  );

  return plaintext; // ArrayBuffer
}
