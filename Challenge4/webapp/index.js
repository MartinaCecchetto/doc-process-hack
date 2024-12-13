// index.js (Azure Function)
const { BlobServiceClient } = require('@azure/storage-blob');
const multipart = require('parse-multipart');

module.exports = async function (context, req) {
    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

    const bodyBuffer = Buffer.from(req.body);
    const boundary = multipart.getBoundary(req.headers['content-type']);
    const parts = multipart.Parse(bodyBuffer, boundary);

    const documentType = parts.find(part => part.name === 'documentType').data.toString();
    const document = parts.find(part => part.name === 'document');

    const containerClient = blobServiceClient.getContainerClient(documentType);
    const blockBlobClient = containerClient.getBlockBlobClient(document.filename);

    try {
        await blockBlobClient.upload(document.data, document.data.length);
        context.res = {
            status: 200,
            body: 'File uploaded successfully!'
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: 'Error uploading file'
        };
    }
};
