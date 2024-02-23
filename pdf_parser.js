const fs = require('fs');
const pdfParse = require('pdf-parse');

// Function to extract billing ID and price from PDF text
const extractDataFromPDF = async (pdfPath) => {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdfParse(dataBuffer);

    // Regular expressions to match billing ID and price
    // Adjust these patterns according to your invoice format
    const billingIdPattern = /Billing ID:\s*(\w+)/;
    const pricePattern = /Total Price:\s*€?(\d+(\.\d{2})?)/;

    const billingIdMatch = data.text.match(billingIdPattern);
    const priceMatch = data.text.match(pricePattern);

    if (billingIdMatch && priceMatch) {
      return {
        billingId: billingIdMatch[1],
        price: priceMatch[1]
      };
    } else {
      throw new Error('Unable to extract billing ID or price from the PDF.');
    }
  } catch (error) {
    console.error(`Error processing PDF: ${error.message}`);
    throw error; // Rethrow to handle outside if needed
  }
};

// Example usage
/*
    extractDataFromPDF('path/to/your/invoice.pdf').then(data => {
      console.log('Extracted Data:', data);
    }).catch(err => {
      console.error('Error:', err);
    });
*/

module.exports = { extractDataFromPDF };
