import { BaseError } from 'error';
import lzutf8 from 'lzutf8';

const keyGenAlgorithm = 'PBKDF2';
const keyGenIterations = 250000;
const keyGenHashFunction = 'SHA-256';
const encryptionAlgorithm = 'AES-GCM';

function concatUint8Arrays(
  firstArr: Uint8Array = new Uint8Array(),
  secondArr: Uint8Array = new Uint8Array(),
): Uint8Array {
  const totalLength = firstArr.length + secondArr.length;
  const result = new Uint8Array(totalLength);
  result.set(firstArr, 0);
  result.set(secondArr, firstArr.length);
  return result;
}

function base64ToByteArray(base64String: string) {
  return Uint8Array.from(atob(base64String), (c) => c.charCodeAt(0));
}

function byteArrayToBase64(byteArray: Uint8Array) {
  return btoa([...new Uint8Array(byteArray)].map((c) => String.fromCharCode(c)).join(''));
}

export class InvalidCredentialsError extends BaseError {}

export async function decryptData(encryptedData: string, b64password: string) {
  try {
    // Convert hashed password to bytes
    const keyData = base64ToByteArray(b64password);

    // Convert base64 encoded encrypted data to bytes and extract initialization vector
    const encryptedBytes = base64ToByteArray(encryptedData);
    const iv = encryptedBytes.slice(0, 16);
    const encryptedDataBytes = encryptedBytes.slice(16).buffer;

    // Generate a cryptokey using the stored password hash for decryption
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { length: keyData.length, name: encryptionAlgorithm },
      false,
      ['decrypt'],
    );
    const decryptedBytes = await crypto.subtle.decrypt(
      { name: encryptionAlgorithm, iv },
      key,
      encryptedDataBytes,
    );
    if (!decryptedBytes) {
      throw new Error('Unable to decrypt data.');
    }

    // Uncompress the decrypted data and return
    const decryptedData = lzutf8.decompress(new Uint8Array(decryptedBytes)) as string;
    return decryptedData;
  } catch (err) {
    throw new InvalidCredentialsError(undefined, err as Error);
  }
}

export async function encryptData(data: string, b64password: string) {
  try {
    // Convert hashed password to bytes
    const keyData = base64ToByteArray(b64password);

    // Generate a random 16 byte initialization vector
    const iv = crypto.getRandomValues(new Uint8Array(16));

    // Generate a new cryptokey using the stored password hash
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { length: keyData.length, name: encryptionAlgorithm },
      false,
      ['encrypt'],
    );

    // Compress the data before encryption
    const compressedData = lzutf8.compress(data);

    // Encrypt the data using AES
    const encryptedData = await crypto.subtle.encrypt(
      { name: encryptionAlgorithm, iv },
      key,
      compressedData,
    );
    // Combine initialization vector and encrypted data and return as base64 encoded string
    const combinedData = concatUint8Arrays(iv, new Uint8Array(encryptedData));
    return byteArrayToBase64(combinedData);
  } catch (err) {
    throw new InvalidCredentialsError(undefined, err as Error);
  }
}

export async function getPasswordHash(password: string, salt: string) {
  const encoder = new TextEncoder();
  const encodedSalt = encoder.encode(salt);

  // Generate a new cryptokey using the stored password hash
  const keyData = encoder.encode(password);
  const importedKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { length: keyData.length, name: keyGenAlgorithm },
    false,
    ['deriveKey'],
  );

  // Run the key through PBKDF2 with many iterations using the provided salt
  const derivedKey = await crypto.subtle.deriveKey(
    {
      name: keyGenAlgorithm,
      salt: encodedSalt,
      iterations: keyGenIterations,
      hash: keyGenHashFunction,
    },
    importedKey,
    { name: encryptionAlgorithm, length: 256 },
    true,
    ['encrypt', 'decrypt'],
  );

  // Export the hashed key
  const exportedKey = await crypto.subtle.exportKey('raw', derivedKey);
  // Convert exported key to base64 encoded string and return
  const base64Key = byteArrayToBase64(new Uint8Array(exportedKey));
  return base64Key;
}
