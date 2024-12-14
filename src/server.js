import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';
//import AWSXRay from 'aws-xray-sdk';
import { router as imageRoutes } from './routes/imageRoutes.js';
import { router as tweetRoutes } from './routes/tweetRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

// Log the correct environment variable
console.log('AWS_BUCKET_NAME:', process.env.AWS_BUCKET_NAME); // Corrected variable name

(async () => {
  //Create an express application
  const app = express(); 
  //default port to listen
  const port = process.env.PORT || 8080; 
  
  //use middleware so post bodies are accessable as req.body
  app.use(bodyParser.json()); 
  app.use(express.urlencoded({ extended: true })) //for requests from forms-like data
  //app.use(AWSXRay.express.openSegment('tweets-app'));

  // Root URI call
  app.get( "/", ( req, res ) => {
    res.status(200).send("Welcome to the Cloud!");
  } );

  app.use(tweetRoutes)
  app.use(imageRoutes)
  //app.use(AWSXRay.express.closeSegment());

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );

  // GET /filteredimage
    app.get('/filteredimage', async (req, res) => {
    const { image_url } = req.query;
  
    // Validate the `image_url` query parameter
    if (!image_url) {
      return res.status(400).send({ message: 'image_url query parameter is required.' });
    }
  
    try {
      // Filter the image
      const filteredPath = await filterImageFromURL(image_url);
  
      // Send the filtered image in the response
      res.sendFile(filteredPath, {}, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          return res.status(500).send({ message: 'Error sending the filtered image.' });
        }
  
        // Delete the filtered image from the local server
        deleteLocalFiles([filteredPath]);
      });
    } catch (error) {
      console.error('Error processing the image:', error);
      return res.status(422).send({ message: 'Unable to process the image. Ensure the URL is valid and publicly accessible.' });
    }
  });
});


  
  


