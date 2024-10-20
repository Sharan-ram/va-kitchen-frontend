import zlib from "zlib";
import { promisify } from "util";

const gunzip = promisify(zlib.gunzip);

export default async function decompressMiddleware(req, res) {
  if (req.headers["content-encoding"] === "gzip") {
    try {
      const chunks = [];

      // Collect the incoming data as raw binary chunks
      req.on("data", (chunk) => {
        chunks.push(chunk);
      });

      // console.log({ chunks });

      // Once the entire request body has been received
      await new Promise((resolve, reject) => {
        req.on("end", async () => {
          try {
            // Concatenate the chunks into a single buffer
            const buffer = Buffer.concat(chunks);

            // Decompress the buffer using gzip
            const decompressed = await gunzip(buffer);

            // Parse the decompressed data as JSON and attach to req.body
            req.body = JSON.parse(decompressed.toString());
            resolve(); // Continue processing
          } catch (error) {
            reject(error);
          }
        });

        req.on("error", (error) => {
          reject(error);
        });
      });
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, message: "Decompression failed" });
    }
  }
}
