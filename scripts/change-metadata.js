const fs = require('fs');
const path = require('path');

// Directory where the JSON files are located
const directoryPath = '../../../../../Documents/REALBRAIN/spec elementy/metadata/json';

// Iterate over the files in the directory
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error('Error reading directory:', err);
    return;
  }

  // Process each file
  files.forEach(file => {
    // Check if the file has a .json extension
    if (path.extname(file) === '.json') {
      // Read the file contents
      const filePath = path.join(directoryPath, file);
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading file:', err);
          return;
        }

        try {
          // Parse the JSON data
          let jsonData = JSON.parse(data);
          const fileName = path.basename(filePath, path.extname(filePath));
          const { external_url, compiler, seller_fee_basis_points, date, edition, imageName, dna, ...rest } = jsonData;
          jsonData = rest;

          const IMAGES_URL_IMPORTANT_WITH_SLASH = 'bafybeiblkryusvgfvs7bahc6b3xkjesdkiyqgmkasi5mgbvq6ikjay3yua/';

          // Update the description field
          jsonData.description =
            'Experience [Spokój Festiwal](https://instagram.com/spokojfestiwal) and get benefits from this exclusive NFT Token.';
          jsonData.image = `ipfs://${IMAGES_URL_IMPORTANT_WITH_SLASH}${fileName}.png`;

          // Convert the updated data back to JSON string
          const updatedData = JSON.stringify(jsonData, null, 2);

          // Write the updated data back to the file
          fs.writeFile(filePath, updatedData, 'utf8', err => {
            if (err) {
              console.error('Error writing file:', err);
            } else {
              console.log('File updated successfully:', file);
            }
          });
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      });
    }
  });
});
