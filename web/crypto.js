class CipherForgeCrypto {
    constructor() {
        this.chunkSize = 65536; // for future chunking
    }

    async encryptFile(file, password) {
        const salt = crypto.getRandomValues(new Uint8Array(32));
        const iv = crypto.getRandomValues(new Uint8Array(12)); // GCM nonce
        const key = await this.deriveKey(password, salt);

        const buffer = await file.arrayBuffer();
        const cipherBuffer = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv: iv },
            key,
            buffer
        );

        const header = new Uint8Array([0x43,0x46,0x21]); // "CF!"
        return new Blob([header, salt, iv, new Uint8Array(cipherBuffer)], {type:"application/octet-stream"});
    }

    async decryptFile(file, password) {
        const buffer = await file.arrayBuffer();
        const data = new Uint8Array(buffer);

        if(data[0]!==0x43 || data[1]!==0x46 || data[2]!==0x21) throw new Error("Not a CipherForge file");

        const salt = data.slice(3, 35);
        const iv = data.slice(35, 47);
        const ciphertext = data.slice(47);

        const key = await this.deriveKey(password, salt);

        let decryptedBuffer;
        try {
            decryptedBuffer = await crypto.subtle.decrypt(
                { name: "AES-GCM", iv: iv },
                key,
                ciphertext
            );
        } catch(e){
            throw new Error("Wrong password or corrupted file");
        }

        return new Blob([new Uint8Array(decryptedBuffer)], {type:"application/octet-stream"});
    }

    async deriveKey(password, salt) {
        const enc = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            "raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]
        );

        const key = await crypto.subtle.deriveKey(
            {name:"PBKDF2", hash:"SHA-256", salt: salt, iterations:100000},
            keyMaterial,
            {name:"AES-GCM", length:256},
            false,
            ["encrypt","decrypt"]
        );

        return key;
    }

    generatePassword(length){
        const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
        let pwd = "";
        for(let i=0;i<length;i++) pwd += chars[Math.floor(Math.random()*chars.length)];
        return pwd;
    }
}

// Initialize global engine
window.cryptoEngine = new CipherForgeCrypto();
