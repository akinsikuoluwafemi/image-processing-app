import fs from "fs";
import Jimp from "jimp";
import axios from "axios";
import path from "path";


// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file

export async function filterImageFromURL(inputURL) {
  return new Promise(async (resolve, reject) => {
    try {
      // make sure the images directory exists

      const imagesDir = path.resolve("./images");
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir);
      }

      // download and process image
      const { data } = await axios.get(inputURL, {
        responseType: "arraybuffer",
      });
      const image = await Jimp.read(data);
      const filename = `filtered.${Math.floor(Math.random() * 2000)}.jpg`;

      const outpath = path.join(imagesDir, filename);
      // const outpath = "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";

      await image
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(outpath, () => resolve(outpath));

    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}


// validate imageUrl
export async function validateImageUrl(imageUrl) {

  const urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])?)\\.)+[a-z]{2,}|" + // domain name
      "localhost|" + // localhost
      "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|" + // OR ipv4
      "\\[?[a-fA-F0-9]*:[a-fA-F0-9:]+\\])" + // OR ipv6
      "(\\:\\d+)?(\\/[ -a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!urlPattern.test(imageUrl);
}
