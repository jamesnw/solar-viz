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
function fetchOverview(){
  return nodeFetch(urlFor('overview'))
    .then((response) => response.json()) 
}
function fetchDetails(){
  return nodeFetch(urlFor('details'))
    .then((response) => response.json()) 
}

exports.handler = async (event, context) => {
  if(event.queryStringParameters?.all){
    return Promise.all([fetchEnvBenefits(), fetchOverview(), fetchDetails()])
    .then((values) => {
      const [envBenefits, overview, details] = values;
      const data = {
        envBenefits: {
          treesPlanted: envBenefits.envBenefits.treesPlanted,
          lightBulbs: envBenefits.envBenefits.lightBulbs
        },
        overview: {
          lifeTimeEnergy: overview.overview.lifeTimeData.energy,
          currentPower: overview.overview.currentPower.power,
        },
        details: {
          peakPower: details.details.peakPower,
          timeZone: details.details.timeZone
        }
      }
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      }
    })
    .catch((error) => ({ statusCode: 422, body: String(error) }));
  } else {
    return fetchOverview()
      .then(overview=>{
        const data = {
          overview: {
            lifeTimeEnergy: overview.overview.lifeTimeData.energy,
            currentPower: overview.overview.currentPower.power,
          }
        }
        return {
          statusCode: 200,
          body: JSON.stringify(data),
        }
      })
      .catch((error) => ({ statusCode: 422, body: String(error) }));
  }
 
};

