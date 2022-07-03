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
  return Promise.all([fetchEnvBenefits()])
  .then((values) => {
    console.log(values);
    const [envBenefits] = values;
    const data = {
      envBenefits: {
        treesPlanted: envBenefits.envBenefits.treesPlanted,
        lightBulbs: envBenefits.envBenefits.lightBulbs
      }
    }
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  })
  .catch((error) => ({ statusCode: 422, body: String(error) }));
};

