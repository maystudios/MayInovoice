const { getAccessToken, getUserInfo } = require('./auth');
const { getAccessTokenENV } = require('./auth');
const axios = require('axios');

// Function to fetch purchases
async function fetchPurchases( lastPurchaseHash = '') {
  const baseUrl = 'https://purchase.izettle.com/purchases/v2';
  const params = new URLSearchParams({
    // Add any additional parameters you need here, like startDate, endDate, limit, descending
  });

  if (lastPurchaseHash) {
    params.append('lastPurchaseHash', lastPurchaseHash);
  }


  try {

      const accessToken = await getAccessTokenENV();

    const response = await axios.get(`${baseUrl}?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    console.log('Purchases:', response.data);
    // Process the purchases as required

    // If there's a next page, handle pagination (not shown here)
  } catch (error) {
    console.error('Error fetching purchases:', error.response ? error.response.data : error.message);
  }
}

// Function to periodically fetch purchases example
/*
  async function startFetching() {
    try {
      setInterval(async () => {
        await fetchPurchases();
      }, 30000); // 30 seconds interval
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

*/

module.exports = { fetchPurchases };