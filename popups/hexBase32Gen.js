function generateSecretKey() {
    const array = new Uint8Array(20);
    crypto.getRandomValues(array);
    return array;
}

function base32Encode(secretKey) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let bits = "";
    let value = "";

    for (let i = 0; i < secretKey.length; i++) {
        bits += secretKey[i].toString(2).padStart(8, '0');
    }

    for (let i = 0; i < bits.length; i += 5) {
        const chunk = bits.substring(i, i + 5);
        const index = parseInt(chunk, 2);
        value += alphabet[index];
    }

    return value;
}

function hexEncode(secretKey) {
    return Array.from(secretKey)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

function generateOTP(secretKey, timestamp = Math.floor(Date.now() / 1000)) {
    let timeInterval = Math.floor(timestamp / 30);
    const packedTime = new Uint8Array(8);

    for (let i = 7; i >= 0; i--) {
        packedTime[i] = timeInterval & 0xff;
        timeInterval >>= 8;
    }

    return crypto.subtle.importKey(
        "raw",
        secretKey,
        { name: "HMAC", hash: "SHA-1" },
        false,
        ["sign"]
    ).then(key => crypto.subtle.sign("HMAC", key, packedTime))
        .then(signature => {
            const offset = new Uint8Array(signature)[19] & 0xf;
            const binary = ((new DataView(signature).getUint32(offset) & 0x7fffffff) % 1000000);
            return binary.toString().padStart(6, '0');
        });
}

function generateAndDisplayKeys() {
    const secretKey = generateSecretKey();
    const hexKey = hexEncode(secretKey);
    const base32Key = base32Encode(secretKey);

    document.getElementById('hexKey').value = hexKey;
    document.getElementById('base32Key').value = base32Key;
}

document.addEventListener('DOMContentLoaded', () => {
    generateAndDisplayKeys();

    document.getElementById('copyHexKey').addEventListener('click', () => {
        const hexKeyInput = document.getElementById('hexKey');
        hexKeyInput.select();
        document.execCommand('copy');
    });

    document.getElementById('copyBase32Key').addEventListener('click', () => {
        const base32KeyInput = document.getElementById('base32Key');
        base32KeyInput.select();
        document.execCommand('copy');
    });

    document.getElementById('refreshKeys').addEventListener('click', () => {
        generateAndDisplayKeys();
    });
});
