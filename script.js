(function () {
    let fullResult = {};
    const demo = () => ({ "envBenefits": { "treesPlanted": 12.1290975, "lightBulbs": 3141.4395 }, "overview": { "lifeTimeEnergy": 1036675, "currentPower": Math.random() * 6000 }, "details": { "peakPower": 6.8 } })
    const isDemo = false;
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
     * @typedef Details
     * @property {number} peakPower
     * @property {string} timeZone
     */
    /**
     * @typedef SolarResult
     * @property {EnvBenefits} envBenefits
     * @property {Overview} overview
     * @property {Details} details
     */
    /**
     * fetchSolar
     * @returns {Promise<SolarResult>}
     */
    function fetchSolar() {
        if (isDemo) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(demo());
                }, 500)
            });
        } else {
            return fetch('.netlify/functions/solar?all=true').then(res => res.json());
        }
    }

    function fetchCurrentPower() {
        return fetch('.netlify/functions/solar').then(res => res.json());
    }
    // Image SVGs have limitations on what CSS is applied, so inline them for full access
    async function inlineSvgs(){
        const treePatterns = ['tree1', 'tree2', 'tree3', 'cloud'];
        const promises =  treePatterns.map(async tree=>{
            return await fetch(`assets/${tree}.svg`).then(res=>res.text()).then(res=>{
                document.getElementById(tree).innerHTML = `<g>${res}</g>`;
            });
        });
        return Promise.all(promises)
    }
    /**
     * makeTree
     * @returns { Node }
     */
    function makeTree() {
        const treePatterns = ['tree1', 'tree2', 'tree3'];
        const patternId = treePatterns[Math.floor(Math.random() * treePatterns.length)]
        const pattern = document.getElementById(patternId);
        const tree = pattern.children[0];
        return tree.cloneNode(true);
    }
    /**
     * makeCloud
     * 
     */
    function makeCloud() {
        const destination = document.getElementById('clouds');
        const pattern = document.getElementById('cloud');
        const cloud = pattern.querySelector('.cloud').cloneNode(true);
        cloud.setAttribute('class', 'cloud');
        cloud.setAttribute('id', 'cloudInstance');
        destination.appendChild(cloud);
        setTimeout(()=>cloud.classList.add('loading'), 1);
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
        const height = parseFloat(document.body.style.getPropertyValue('--height'));
        const width = parseFloat(document.body.style.getPropertyValue('--width'));
        let fullTrees = [];
        for (let index = 0; index < fullTreeCount; index++) {
            const newTree = makeTree();
            const x = randomIntFromInterval(-25, width - 50);
            const y = randomIntFromInterval(180, height - 100);
            const scale = .5;
            newTree.setAttribute('transform', `translate(${x}, ${y}) scale(${scale})`)
            // newTree.getElementsByClassName('translate')[0].setAttribute('transform', `translate(${x}, ${y})`)
            newTree.setAttribute('data-y', `${y}`)
            fullTrees.push(newTree)
        }
        fullTrees = fullTrees.sort((a, b) => {
            return parseInt(a.dataset.y) - parseInt(b.dataset.y)
        })
        const totalLength = 2000;
        const delayForEach = totalLength / fullTrees.length;
        fullTrees.forEach((t, index) => {
            setTimeout(() => el.appendChild(t), delayForEach * index)
        });
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
    /**
     * moveSun
     * @param {SolarResult} result 
     */
    function moveSun({ overview, details }) {
        const full = -250;
        const percentPower = overview.currentPower / (details.peakPower * 1000);
        const distance = full * percentPower;
        const sunPath = document.getElementById('sunPath');
        sunPath.setAttribute('transform', `translate(0,${distance})`);
    }
    function draw() {
        fetchSolar().then(res => {
            fullResult = res;
            makeTrees(res.envBenefits);
            makeOverview(res.overview);
            moveSun(res);
            document.body.classList.replace('loading', 'loaded');
        })
    }

    function drawRefresh() {
        // document.getElementById('cloudInstance').remove();
        // makeCloud();
        fetchCurrentPower().then(({ overview }) => {
            moveSun({ details: fullResult.details, envBenefits: fullResult.envBenefits, overview });
            makeOverview(overview)
        });
    }
   
    function setDimensions(){
        const {clientHeight, clientWidth} = document.body;
        document.body.style.setProperty('--height', clientHeight.toString());
        document.body.style.setProperty('--width', clientWidth.toString());
        const landscape = document.getElementById('landscape');
        landscape.setAttribute('viewBox', `0 0 ${clientWidth} ${clientHeight}`)
    }
    document.addEventListener("DOMContentLoaded", async function (event) {
        setDimensions();
        await inlineSvgs();
        draw();
        // makeCloud();
        document.addEventListener("visibilitychange", handleVisibilityChange, false);
       
    });

    let interval = undefined;
    function startRefresh(){
        drawRefresh();
       interval = setInterval(drawRefresh, 30000)
    }
    function stopRefresh(){
        clearInterval(interval);
    }
    function handleVisibilityChange(){
        if(document.visibilityState === 'hidden'){
            stopRefresh();
        } else {
            startRefresh();
        }
    }
   


    const seasonChangeButton = document.getElementById('season-change');
    seasonChangeButton.addEventListener('click', ()=>{
        const [toggleTo, toggleFrom] = document.body.classList.contains('spring') ? ['fall', 'spring'] : ['spring', 'fall'];
        document.body.classList.replace(toggleFrom, toggleTo);
    })
})()