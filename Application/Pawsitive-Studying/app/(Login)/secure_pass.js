import bcrypt from "react-native-bcrypt";
import { generateSecureRandom } from "react-native-securerandom";

/* Set the work factor for the bcrypt hashing */
/* Higher work factor are more secure, but slower hashing */
const workFactor = 13;

export function generateHash(password) {
    /* Library does not support secure  number generation, so we have to use a alt rng */
    bcrypt.setRandomFallback((len) => {
        generateSecureRandom(len).then((randomBytes) => {
            return randomBytes;
        });
    });
    /* Generate the salt and hash the password */
    /* Takes a while to resolve, so we return a promise */
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(workFactor, (err, salt) => {
            if (err) {
                reject(err);
            } else {
                bcrypt.hash(password, salt, (err2, hashPass) => {
                    if (err2) {
                        reject(err2);
                    } else {
                        return resolve(hashPass);
                    }
                });
            }
        });
    });
}
