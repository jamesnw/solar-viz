exports.handler = async function (event, context) {
    return {
      statusCode: 200,
      body: JSON.stringify({ api: process.env.API_KEY, site: process.env.SITE }),
    };
  }
 const fetch = require("node-fetch");

const API_ENDPOINT = `https://monitoringapi.solaredge.com/site/${process.env.SITE}/envBenefits?api_key=${process.env.API_KEY}`;

exports.handler = async (event, context) => {
  return fetch(API_ENDPOINT, { headers: { Accept: "application/json" } })
    .then((response) => response.json())
    .then((data) => ({
      statusCode: 200,
      body: data,
    }))
    .catch((error) => ({ statusCode: 422, body: String(error) }));
};