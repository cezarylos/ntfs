const fs = require('fs');
const path = require('path');

// Directory where the JSON files are located
const directoryPath = '../../../../../Downloads/wetransfer_5-motylson-skrzydla-png_2023-05-23_1723/Spokojtest-export/May 23, 2023, 9-59 PM/metadata/';

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
                    const { external_url, attributes, compiler, seller_fee_basis_points, ...rest } = jsonData;
                    jsonData = rest;

                    // Update the description field
                    jsonData.description = 'New description';

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
