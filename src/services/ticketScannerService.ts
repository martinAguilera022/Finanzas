import Tesseract from "tesseract.js";

export async function scanTicket(imageFile: File): Promise<string> {
  const result = await Tesseract.recognize(imageFile, "spa", {
    logger: (m) => console.log(m), // Muestra el progreso en consola
  });

  return result.data.text;
}
