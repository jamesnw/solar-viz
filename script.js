const demo = { "envBenefits": { "gasEmissionSaved": { "units": "kg", "co2": 408.5639, "so2": 295.23538, "nox": 94.149864 }, "treesPlanted": 6.799712400000001, "lightBulbs": 1761.1273 } }
const isDemo = !window.location.host;
/**
 * @typedef EnvBenefits
 * @property {number} lightBulbs
 * @property {number} treesPlanted
 */
/**
 * @typedef EnvBenefitsResult
 * @property {EnvBenefits} envBenefits
 */
/**
 * fetchEnvBenefits
 * @returns {Promise<EnvBenefitsResult>}
 */
function fetchEnvBenefits() {
    if (isDemo) {
        return Promise.resolve(demo);
    } else {
        return fetch('.netlify/functions/envBenefits').then(res => res.json());
    }
}
/**
 * makeTrees
 * @param {EnvBenefits} envBenefits 
 */
function makeTrees({ treesPlanted }) {
    const el = document.getElementById('trees');
    const fullTrees = Math.floor(treesPlanted);
    el.innerText = Array(fullTrees + 1).join('🌳');
}
/**
 * makeBulbsSvg
 * @param {EnvBenefits} envBenefits 
 */
function makeBulbsSvg({ lightBulbs }) {
    const el = document.getElementById('bulbs');
    const bulbGroup = document.getElementById('bulb-group');
    const fullBulbs = Math.floor(lightBulbs);
    const ratio = el.clientWidth / el.clientHeight;

    let rows = Math.sqrt(fullBulbs / ratio);
    const columns = Math.ceil(fullBulbs / rows);

    rows = Math.ceil(rows);

    el.setAttribute('viewBox', `0 0 ${columns * 20} ${rows * 20}`);

    const offset = 20;
    const fullRows = rows - 1;
    const remainder = Math.floor(lightBulbs - (fullRows * (columns-1)));
    console.log({remainder, columns, lightBulbs,rows, fullRows })
    for (let index = 0; index < rows; index++) {
        const text = makeTextElement();
        const bulbsInRow = index === rows - 1 ? remainder + 1 : columns + 1;
        text.textContent = Array(bulbsInRow).join('💡');
        const y = offset * index + 15;
        text.setAttribute('y',y.toString())
        bulbGroup.appendChild(text);
    }
   
}
fetchEnvBenefits().then(res => res.envBenefits).then(res => {
    makeTrees(res);
    // makeBulbs(res);
    makeBulbsSvg(res);
})
/**
 * makeTextElement
 * @returns {SVGTextElement}
 */
function makeTextElement() {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('letter-spacing', '4px')
    return text;
}