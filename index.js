require('dotenv').config();
const { sendProductToZettle, deleteProductByUuid , createDienstleistung } = require('./createProduct');
const axios = require('axios');
const { getAccessTokenENV, getUserInfoENV } = require('./auth');
const { fetchPurchases } = require('./fetchPurchases');
const { extractDataFromPDF } = require('./pdf_parser');
const { v1: uuidv1 } = require('uuid');

const uuid = uuidv1();

async function run(productData) {
  try {
    // Senden des Produkts
    await sendProductToZettle(productData);
    console.log('Produkt erfolgreich gesendet.');
  } catch (error) {
    console.error(error);
  }

  // Löschen des Produkts nach 60 Sekunden
  setTimeout(async () => {
    try {
      await deleteProductByUuid(uuid);
    } catch (error) {
      console.error(error);
    }
  }, 10000);
}

// Produktinformationen
function start() {
    extractDataFromPDF('C:/Users/crazy/OneDrive/Desktop/Java/MayInovocie/BillingABC123.pdf')
    .then(({ billingId, price }) => {
        console.log('Billing ID:', billingId);
        // replace , with nothing and add two zeros to the end
        price = parseFloat(price);
        price = price.toFixed(2);
        price = price.toString();
        price = price.replace('.','');
        price = price.replace(',','');

        console.log('Price:', price);

        const productData = createDienstleistung(uuid,billingId, price, 0);
        console.log('Product data:', productData);
        run(productData);
    })
    .catch(error => {
        console.error(error);
    });
}

  async function startFetching() {
    try {
      setInterval(async () => {
        await fetchPurchases();
      }, 5000); // 5 seconds interval
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  // Start program
start();