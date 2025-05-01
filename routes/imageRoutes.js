import express from 'express';
import { filterImageFromURL, deleteLocalFiles, validateImageUrl } from '../util/util.js';


export const router = express.Router();

router.get(`/filteredimage`, async (req, res) => {

  const imageUrl = req.query.image_url;

  if (!imageUrl) {
    return res
      .status(400)
      .send({ message: "image_url is required" });
  }
  // validate the image URL
  const isValidUrl = await validateImageUrl(imageUrl);
  if (!isValidUrl) {
     return res
       .status(422)
       .send({ message: "image_url is invalid" });
  }


  const filteredImagePath = await filterImageFromURL(imageUrl);

  return res.status(200).sendFile(filteredImagePath, async (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).send("Error processing image.");
    }

    // delete files after sending
    res.on("finish", () => {
      deleteLocalFiles([filteredImagePath]);
    })
  });
});