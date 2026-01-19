import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const personalInfoPath = path.join(process.cwd(), "data", "personal-info.json");

export async function updatePersonalInfo(
    newData: Record<string, any>,
): Promise<void> {
    try {
        const currentData = JSON.parse(
            await readFile(personalInfoPath, "utf-8"),
        );
        const updatedData = { ...currentData, ...newData };
        await writeFile(
            personalInfoPath,
            JSON.stringify(updatedData, null, 4),
            "utf-8",
        );
    } catch (error) {
        console.error("Failed to update personal info:", error);
        throw new Error("Failed to update personal info.");
    }
}
