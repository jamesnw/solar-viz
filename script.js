const demo = {
    "envBenefits": { "treesPlanted": 7.3393749, "lightBulbs": 1900.9 }, "overview": { "lifeTimeEnergy": 627297, "currentPower": 16.84185 }
}
const isDemo = !window.location.host;
/**
 * @typedef EnvBenefits
 * @property {number} lightBulbs
 * @property {number} treesPlanted
 */
/**
 * @typedef Overview
 * @property {number} lifeTimeEnergy
 * @property {number} currentPower
 */
/**
 * @typedef SolarResult
 * @property {EnvBenefits} envBenefits
 * @property {Overview} overview
 */
/**
 * fetchSolar
 * @returns {Promise<SolarResult>}
 */
function fetchSolar() {
    if (isDemo) {
        return Promise.resolve(demo);
    } else {
        return fetch('.netlify/functions/solar').then(res => res.json());
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
    const remainder = Math.floor(lightBulbs - (fullRows * (columns - 1)));

    for (let index = 0; index < rows; index++) {
        const text = makeTextElement();
        const bulbsInRow = index === rows - 1 ? remainder + 1 : columns + 1;
        text.textContent = Array(bulbsInRow).join('💡');
        const y = offset * index + 15;
        text.setAttribute('y', y.toString())
        bulbGroup.appendChild(text);
    }

}
/**
 * makeOverview
 * @param {Overview} overview
 */
function makeOverview(overview){
    const lifetimeEl = document.getElementById('lifetime-value')
    const currentEl = document.getElementById('current-value')

    lifetimeEl.innerText = overview.lifeTimeEnergy.toString();
    currentEl.innerText = overview.currentPower.toString();
}

fetchSolar().then(res => {
    makeTrees(res.envBenefits);
    makeBulbsSvg(res.envBenefits);
    makeOverview(res.overview)
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