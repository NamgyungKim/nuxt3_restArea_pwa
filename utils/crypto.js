// TODO: import CryptoJS from 'crypto-js' 를 이 파일에서 import 할 수 없을까?
const crypto = (CryptoJS) => {
  const iv = 'abcdefghijklmnop';
  const env = runtimeConfig();
  const key = env.public.cryptoKey;

  const cfg = {
    iv: CryptoJS.enc.Utf8.parse(iv),
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  };

  const cryptoKey = CryptoJS.enc.Utf8.parse(key);

  return {
    getCrypto: (data) => CryptoJS.AES.encrypt(data, cryptoKey, cfg).toString(),
    deCrypto: (data) => CryptoJS.AES.decrypt(data, cryptoKey, cfg).toString(CryptoJS.enc.Utf8),
  };
};

export default crypto;
