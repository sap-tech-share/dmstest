const cds = require("@sap/cds");
const multer = require("multer");
const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();
const { SendDocumentToDMS } = require('./lib/dms-process');
const fs = require('fs');
console.log(appEnv);


cds.on("bootstrap", (app) => {
  // Process function. Function can accept multipart formdata; So, the custom handler of the service can be triggered
  const DMSProcessFunc = async (req, res, next) => {
    let uploadResult = await SendDocumentToDMS(req);
    // Pass upload result to function handler
    req.data = {};
    req.data.uploadResult = uploadResult;
    next();
  };
  
  // Process function. Function CANNOT accept multipart formdata; So, the custom handler of the service CANNOT be triggered
  const DMSProcessAct = async (req, res, next) => {
    let uploadResult = await SendDocumentToDMS(req);
    // Send the response and stop any further processing
    res.status(uploadResult.status).send(uploadResult.data);
  };

// Store file data to application stoage  
  // const storage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, "uploads");
  //   },
  //   filename: (req, file, cb) => {
  //     const { originalname } = file;
  //     cb(null, `${Date.now()}-${originalname}`);
  //   },
  // });

// Store file data to memory
  const storage = multer.memoryStorage();

// Upload file using multer library  
  const upload = multer({ storage: storage });

// When test function is triggered, upload the file and then call function to upload to DMS
  app.get("*/my/TestFunction()*", upload.single("file"), DMSProcessFunc);
// When test function is triggered, upload the file and then call function to upload to DMS  
  app.post("*/my/TestAction", upload.single("file"), DMSProcessAct);
});

module.exports = cds.server;
