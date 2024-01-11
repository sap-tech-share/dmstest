const FormData = require('form-data');
const fs = require('fs');
const { Readable } = require('stream');
const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');

const SendDocumentToDMS = async (req) => {
  
  // let repoId = 'e39f2fd1-8077-4404-a5be-c5d6183e2b64';
  let repoId = req.body.repoId;

  // FormData to pass the file to DMS
  let data = new FormData();
  // In case file is stored in application server, createReadStream to be used
  // data.append('file', fs.createReadStream('test1111.txt'));
  // Convert filedata from memory as a stream
  const stream = Readable.from(req.file.buffer);
  data.append('file', stream, { filename: req.file.originalname, contentType: req.file.mimetype });
  // Populate few properties as required
  data.append('cmisaction', 'createDocument');
  data.append('propertyId[0]', 'cmis:objectTypeId');
  data.append('propertyValue[0]', 'cmis:document');
  data.append('propertyId[1]', 'cmis:name');
  data.append('propertyValue[1]', req.file.originalname);

  // Trigger upload to DMS. The repository ID is passed in the URL and the file is uploaded to root folder itself
  const createResponse = await executeHttpRequest(
    { destinationName: 'DMS' },
    {
      method: 'post', url: '/browser/' + repoId + '/root',
      data: data
    })
    .then((response) => {
      //   console.log('CreateRes>>>>', JSON.stringify(response.data));
      console.log('CreateRes>>>>', JSON.stringify(response.data.properties['cmis:objectId'].value));
      // return response.data;
      return { status: response.status, data: { message: response.statusText, objectId: response.data.properties['cmis:objectId'].value, name: response.data.properties['cmis:name'].value } };
    })
    .catch((error) => {
      // console.log('CreateErr>>>', error);
      return { status: error.response.status, data: { message: error.response.data.message, exception: error.response.data.exception } };
    });
  console.log(createResponse);
  return createResponse;
}
module.exports = { SendDocumentToDMS }