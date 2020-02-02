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
let allRecipesHTML;

let seriousEatsPath = path.join(
    __dirname,
    '/websites/Aioli_Recipe_Serious_Eats.htm',
);

let allRecipesPath = path.join(__dirname, '/websites/AllRecipesRecipe.html');

beforeAll(async () => {
    try {
        let content = await readFile(seriousEatsPath, 'utf8');
        seriousEatsHTML = await cheerio.load(content);

        content = await readFile(allRecipesPath, 'utf8');
        allRecipesHTML = await cheerio.load(content);
    } catch (error) {
        console.log(error);
    }
});
/*
test('get steps from a serious eats recipe', async () => {
    const steps = await getStepsFromWebPage(seriousEatsHTML);
    expect(steps.length).toBe(2);

    expect(steps[0].value).toEqual(
        'Place egg, garlic, and lemon juice in the bottom of an immersion blender cup. Pour canola (or vegetable or light olive) oil on top and allow to settle for 15 seconds. Place head of immersion blender at bottom of cup and switch it on. As aioli forms, slowly tilt and lift the head of the immersion blender until all oil is emulsified. (For food processor instructions, see note).',
    );
});

test('get ingredients from a serious eats recipe', async () => {
    const ingredients = await getIngredientsFromWebPage(seriousEatsHTML);
    expect(ingredients.length).toBe(6);

    expect(ingredients[0].value).toEqual('1 whole egg');
    expect(ingredients[5].value).toEqual(
        'Kosher salt and freshly ground black pepper',
    );
});
*/
test('get steps from an allrecipes recipe', async () => {
    const steps = await getStepsFromWebPage(allRecipesHTML);
    expect(steps.length).toBe(3);
    console.log('PRINT FUNCTION RESULTS: ' + steps[0].value);
    expect(steps[0].value).toEqual(
        'Heat ghee in a large skillet over medium heat and cook and stir onion until translucent, about 5 minutes. Stir in garlic; cook and stir just until fragrant, about 1 minute. Stir cumin, 1 teaspoon salt, ginger, cayenne pepper, cinnamon, and turmeric into the onion mixture; fry until fragrant, about 2 minutes.',
    );
});
