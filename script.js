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
 * makeTreesText
 * @param {EnvBenefits} envBenefits 
 */
function makeTreesText({ treesPlanted }) {
    const el = document.getElementById('treesText');
    const fullTrees = Math.floor(treesPlanted);
    el.innerText = Array(fullTrees + 1).join('🌳');
}
/**
 * makeTree
 * @returns { SVGGElement }
 */
function makeTree() {
    const treePatterns = ['tree1', 'tree2', 'tree3'];
    const patternId = treePatterns[Math.floor(Math.random() * treePatterns.length)]
    const pattern = document.getElementById(patternId);
    const tree = pattern.children[0];
    return tree.cloneNode(true);
}
/**
 * 
 * @param {number} min 
 * @param {number} max 
 * @returns 
 */
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
/**
 * makeTrees
 * @param {EnvBenefits} envBenefits 
 */
function makeTrees({ treesPlanted }) {
    const el = document.getElementById('trees');
    const fullTreeCount = Math.floor(treesPlanted);
    let fullTrees = [];
    for (let index = 0; index < fullTreeCount; index++) {
        const newTree = makeTree();
        const x = randomIntFromInterval(20,980);
        const y = randomIntFromInterval(200,600);
        const scale = .5;
        newTree.setAttribute('transform', `translate(${x}, ${y}) scale(${scale})`)
        // newTree.getElementsByClassName('translate')[0].setAttribute('transform', `translate(${x}, ${y})`)
        newTree.setAttribute('data-y', `${y}`)
        fullTrees.push(newTree)
    }
    fullTrees = fullTrees.sort((a,b)=>{
        return parseInt(a.dataset.y) - parseInt(b.dataset.y)
    })
    const totalLength = 2000;
    const delayForEach = totalLength / fullTrees.length;
    fullTrees.forEach((t, index)=>{
        setTimeout(()=>el.appendChild(t), delayForEach * index)
    });
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
function makeOverview({ lifeTimeEnergy, currentPower }) {
    const lifetimeEl = document.getElementById('lifetime-value');
    const currentEl = document.getElementById('current-value');

    const lifetimeDisplay = (lifeTimeEnergy / 1000).toString() + 'kWh';

    lifetimeEl.innerText = lifetimeDisplay;
    currentEl.innerText = currentPower.toString() + 'W';
}

fetchSolar().then(res => {
    makeTrees(res.envBenefits);
    // makeBulbsSvg(res.envBenefits);
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