require('dotenv').config();
const axios = require('axios');

/**
 * Retrieves an access token from Zettle OAuth server.
 *
 * @param {string} clientId - The client ID of your app.
 * @param {string} apiKey - The API key (assertion) generated by the user.
 * @returns {Promise<string>} - The access token.
 */
async function getAccessToken(clientId, apiKey) {
  const tokenUrl = 'https://oauth.zettle.com/token';
  const params = new URLSearchParams();
  params.append('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer');
  params.append('client_id', clientId);
  params.append('assertion', apiKey);

  try {
    const response = await axios.post(tokenUrl, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (response.data.access_token) {
      return response.data.access_token;
    } else {
      throw new Error('Access token not found in response.');
    }
  } catch (error) {
    console.error('Error retrieving access token:', error.response ? error.response.data : error.message);
    throw error;
  }
}

/**
 * Retrieves user information from Zettle OAuth server.
 *
 * @param {string} accessToken - The access token for authentication.
 * @returns {Promise<object>} - The user information including organizationUuid.
 */
async function getUserInfo(accessToken) {
  const userInfoUrl = 'https://oauth.zettle.com/users/self';

  try {
    const response = await axios.get(userInfoUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Dies gibt das User-Objekt zurück, einschließlich organizationUuid
  } catch (error) {
    console.error('Error retrieving user information:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function getAccessTokenENV() {
    const clientId = process.env.ZETTLE_CLIENT_ID; // Ihre Zettle Client ID
    const apiKey = process.env.ZETTLE_API_KEY; // Der API-Schlüssel des Benutzers

    try {
      const accessToken = await getAccessToken(clientId, apiKey);
      return accessToken;
    } catch (error) {
      console.error('Error:', error.message);
    }
}

async function getUserInfoENV() {
    const clientId = process.env.ZETTLE_CLIENT_ID; // Ihre Zettle Client ID
    const apiKey = process.env.ZETTLE_API_KEY; // Der API-Schlüssel des Benutzers

    try {
      const accessToken = await getAccessToken(clientId, apiKey);
      const userInfo = await getUserInfo(accessToken);
      return userInfo;
    } catch (error) {
      console.error('Error:', error.message);
    }

}

module.exports = { getAccessTokenENV, getUserInfoENV};
