const {
    getStepsFromWebPage,
    getIngredientsFromWebPage,
} = require('../parseRecipe.js');
let cheerio = require('cheerio');

const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const path = require('path');
let seriousEatsHTML;

let seriousEatsPath = path.join(
    __dirname,
    '/websites/Aioli_Recipe_Serious_Eats.htm',
);

beforeAll(async () => {
    try {
        const content = await readFile(seriousEatsPath, 'utf8');
        seriousEatsHTML = await cheerio.load(content);
    } catch (error) {
        console.log(error);
    }
});

test('get steps from a serious eats recipe', async () => {
    //console.log('TEST PRINT' + aioliRecipe);
    const steps = await getStepsFromWebPage(seriousEatsHTML);
    console.log(steps);
    expect(steps.length).toBe(2);
});
