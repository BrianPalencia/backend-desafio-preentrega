import fs from "fs";

import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

async function readFile(file) {
    try {
        let readfilename = __dirname + "/" + file;
        console.log("readfile", readfilename);
        let result = await fs.promises.readFile(__dirname + "/" + file, "utf-8");
        let data = await JSON.parse(result);
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function writeFile(file, data) {
    try {
        await fs.promises.writeFile(__dirname + "/" + file, JSON.stringify(data));
        return true;
    } catch (err) {
        console.log(err);
    }
}

async function deleteFile(file) {
    try {
        await fs.promises.unlink(__dirname + "/" + file);
        return true;
    } catch (err) {
        console.log(err);
    }
}


export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPassword = (savedPassword, password) => {
    console.log(savedPassword);
    console.log(bcrypt.hashSync(password, bcrypt.genSaltSync(10)));

    return bcrypt.compareSync(password, savedPassword);
};

export default { readFile, writeFile, deleteFile };