// auth.js wird vorausgesetzt, dass es im gleichen Verzeichnis liegt
const { getAccessTokenENV, getUserInfoENV } = require('./auth');
const axios = require('axios');
const { v1: uuidv1 } = require('uuid');
require('dotenv').config();

/**
 * Sendet Produktinformationen an Zettle.
 *
 * @param {Object} productData - Daten des Produkts, das hinzugefügt werden soll. Ohne uuid.
 */
async function sendProductToZettle(productData) {
  try {

    const accessToken = await getAccessTokenENV();
    console.log('Access token retrieved successfully:', accessToken);

    const userInfo = await getUserInfoENV();
    const organizationUuid = userInfo.organizationUuid;
    console.log('User information retrieved successfully organizationUuid:', organizationUuid);

    const options = {
      method: 'POST',
      url: `https://products.izettle.com/organizations/${organizationUuid}/products`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      data: productData
    };

    const response = await axios(options);
    if (response.status === 201) {
      console.log('Produkt erfolgreich gesendet.');
    }
  } catch (error) {
    console.error('Fehler beim Senden des Produkts:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
  }
}

/**
 * Deletes a specific product by UUID for a given organization.
 *
 * @param {string} organizationUuid - The UUID of the organization.
 * @param {string} productUuid - The UUID of the product to delete.
 * @param {string} accessToken - The bearer token for authentication.
 */
async function deleteProductByUuid(productUuid) {
  try {
    const accessToken = await getAccessTokenENV();
    console.log('Access token retrieved successfully:', accessToken);

    const userInfo = await getUserInfoENV();
    const organizationUuid = userInfo.organizationUuid;
    console.log('User information retrieved successfully organizationUuid:', organizationUuid);

    const url = `https://products.izettle.com/organizations/${organizationUuid}/products/${productUuid}`;

    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Assuming a successful deletion might not return a body, or you might check for a specific response status
    if (response.status === 204) { // HTTP 204 No Content is a common response for successful DELETE requests
      console.log('Product successfully deleted.');
    } else {
      // Handle unexpected response
      console.log('Unexpected response status:', response.status);
    }
  } catch (error) {
    console.error('Error deleting the product:', error.response ? error.response.data : error.message);
    throw error; // Rethrow or handle error as needed
  }
}

function createDienstleistung(uuid, name, price, vatPercentage) {
    const productData = {
        uuid: uuid,
        name: name,
        variants: [{
        uuid: uuidv1(),
        name: name,
        description: name,
        sku: null,
        barcode: null,
        price: { amount: price, currencyId: "EUR" },
        costPrice: null,
        vatPercentage: vatPercentage,
        options: null,
        presentation: null
        }],
        variantOptionDefinitions: null
    };
    return productData;
}

module.exports = { sendProductToZettle, deleteProductByUuid, createDienstleistung };