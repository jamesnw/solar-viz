const demo = { "envBenefits": { "gasEmissionSaved": { "units": "kg", "co2": 144.7252, "so2": 104.58095, "nox": 33.350616 }, "treesPlanted": 2.4086556, "lightBulbs": 623.8424 } }
const isDemo = !window.location.host;

function fetchEnvBenefits() {
    if (isDemo) {
        return Promise.resolve(demo);
    } else {
        return fetch('.netlify/functions/envBenefits').then(res=>res.json());
    }
}
function makeTrees({treesPlanted}){
    const el = document.getElementById('trees');
    const fullTrees = Math.floor(treesPlanted); 
    el.innerHTML = Array(fullTrees).join('🌳');
}
function makeBulbs({lightBulbs}){
    const el = document.getElementById('bulbs');
    const fullBulbs = Math.floor(lightBulbs); 
    el.innerHTML = Array(fullBulbs).join('💡');
}
fetchEnvBenefits().then(res=>res.envBenefits).then(res => {
   makeTrees(res);
   makeBulbs(res);
})

