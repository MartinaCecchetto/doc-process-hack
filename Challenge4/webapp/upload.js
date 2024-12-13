// upload.js
document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('documentType', document.getElementById('documentType').value);
    formData.append('document', document.getElementById('document').files[0]);

    const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
    });

    if (response.ok) {
        alert('File uploaded successfully!');
    } else {
        alert('Error uploading file');
    }
});
