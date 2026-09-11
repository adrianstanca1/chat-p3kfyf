import CryptoJS from 'crypto-js';

const getOrCreateKey = () => {
  let key = localStorage.getItem('vf_key');
  if (!key) {
    key = CryptoJS.lib.WordArray.random(256/8).toString();
    localStorage.setItem('vf_key', key);
  }
  return key;
};

export const encrypt = (data: string) => CryptoJS.AES.encrypt(data, getOrCreateKey()).toString();
export const decrypt = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, getOrCreateKey());
  return bytes.toString(CryptoJS.enc.Utf8);
};