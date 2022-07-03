const nodeFetch = require("node-fetch");

/**
 * 
 * @param {string} endpoint 
 * @returns {string}
 */
function urlFor(endpoint){
  return  `https://monitoringapi.solaredge.com/site/${process.env.SITE}/${endpoint}?api_key=${process.env.API_KEY}`;
}

function fetchEnvBenefits(){
  return nodeFetch(urlFor('envBenefits'))
  .then((response) => response.json()) 
}

exports.handler = async (event, context) => {
  return Promise.all([fetchEnvBenefits])
  .then(([envBenefits]) => ({
    statusCode: 200,
    body: JSON.stringify(envBenefits),
  }))
  .catch((error) => ({ statusCode: 422, body: String(error) }));
};

