
import Cryptr from 'cryptr';


export const encrypt = (text: string): string => {
    const secretkey = process.env.AUTH_SECRET;
    const cryptr = new Cryptr(secretkey!);

    const encryptedString = cryptr.encrypt(text);
    console.log("secretkey", encryptedString);
    return encryptedString;
}

export const decrypt = (encryptedString: string): string => {
    const secretkey = process.env.AUTH_SECRET;
    const cryptr = new Cryptr(secretkey!);

    const decryptedString = cryptr.decrypt(encryptedString);
    return decryptedString;
}