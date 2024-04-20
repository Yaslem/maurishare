
import { join } from "path";
import { mkdir, stat, writeFile } from "fs/promises";
import fs from "node:fs/promises";
interface Args {
    folder: string;
    file?: FormDataEntryValue;
    filename?: string
}
export default class File {
    static rootPath = "/public/uploads"
    static async upload({folder, file, filename}: Args) {
        const uploadDir = join(
            process.env.ROOT_DIR || process.cwd(),
            `${this.rootPath}/${folder}/`
        );
        const buffer = Buffer.from(await file.arrayBuffer());
        try {
            await stat(uploadDir);
        } catch (e) {
            if (e.code === "ENOENT") {
                await mkdir(uploadDir, { recursive: true });
            } else {
                console.error(e);
            }
        }
        await writeFile(
            uploadDir + filename,
            buffer
        );

        return;
    }

    static async isExist({folder, file}: Args) {
        try {
            return (await fs.stat(`${this.rootPath}/${folder}/${file}`)).isFile();
        } catch (e) {
            return false;
        }
    }

    static async delete({folder, file}: Args) {
        try {
            await fs.unlink(`${this.rootPath}/${folder}/${file}`);
            return true
        } catch (e) {
            return false;
        }
    }
}