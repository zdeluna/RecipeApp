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
let damnDeliciousHTML;
let foodNetworkHTML;

let seriousEatsPath = path.join(
    __dirname,
    '/websites/Aioli_Recipe_Serious_Eats.htm',
);

let allRecipesPath = path.join(__dirname, '/websites/AllRecipesRecipe.html');
let damnDeliciousPath = path.join(
    __dirname,
    '/websites/DamnDeliciousRecipe.html',
);
let foodNetworkPath = path.join(__dirname, '/websites/FoodNetworkRecipe.html');

beforeAll(async () => {
    try {
        let content = await readFile(seriousEatsPath, 'utf8');
        seriousEatsHTML = await cheerio.load(content);

        content = await readFile(allRecipesPath, 'utf8');
        allRecipesHTML = await cheerio.load(content);

        content = await readFile(damnDeliciousPath, 'utf8');
        damnDeliciousHTML = await cheerio.load(content);

        content = await readFile(foodNetworkPath, 'utf8');
        foodNetworkHTML = await cheerio.load(content);
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

test('get steps from an allrecipes recipe', async () => {
    const steps = await getStepsFromWebPage(allRecipesHTML);
    expect(steps.length).toBe(3);
    console.log('PRINT FUNCTION RESULTS: ' + steps[0].value);
    expect(steps[0].value).toEqual(
        'Heat ghee in a large skillet over medium heat and cook and stir onion until translucent, about 5 minutes. Stir in garlic; cook and stir just until fragrant, about 1 minute. Stir cumin, 1 teaspoon salt, ginger, cayenne pepper, cinnamon, and turmeric into the onion mixture; fry until fragrant, about 2 minutes.',
    );
    expect(steps[1].value).toEqual(
        'Stir tomato sauce into the onion and spice mixture, bring to a boil, and reduce heat to low. Simmer sauce for 10 minutes, then mix in cream, paprika, and 1 tablespoon sugar. Bring sauce back to a simmer and cook, stirring often, until sauce is thickened, 10 to 15 minutes.',
    );
    expect(steps[2].value).toEqual(
        'Heat vegetable oil in a separate skillet over medium heat. Stir chicken into the hot oil, sprinkle with curry powder, and sear chicken until lightly browned but still pink inside, about 3 minutes; stir often. Transfer chicken and any pan juices into the sauce. Simmer chicken in sauce until no longer pink, about 30 minutes; adjust salt and sugar to taste.',
    );
});

test('get ingredients from an allrecipes recipe', async () => {
    const ingredients = await getIngredientsFromWebPage(allRecipesHTML);
    expect(ingredients.length).toBe(18);
    expect(ingredients[0].value).toEqual(
        '2 tablespoons ghee (clarified butter)',
    );
    expect(ingredients[1].value).toEqual('1  onion, finely chopped');
});

test('get steps from a damn delicious recipe', async () => {
    const steps = await getStepsFromWebPage(damnDeliciousHTML);
    expect(steps.length).toBe(7);
    expect(steps[0].value).toEqual(
        'FOR THE KOREAN BEEF: In a small bowl, whisk together brown sugar, soy sauce, ginger, sesame oil and Sriracha.',
    );
    expect(steps[6].value).toEqual(
        'Divide farro into bowls. Top with ground beef mixture, kimchi, cabbage and avocado, drizzled with Sriracha mayonnaise and garnished with green onions and sesame seeds, if desired.',
    );
});

test('get ingredients from a damn delicious recipe', async () => {
    const ingredients = await getIngredientsFromWebPage(damnDeliciousHTML);
    expect(ingredients.length).toBe(19);
    expect(ingredients[0].value).toEqual('1/4 cup brown sugar, packed');
    expect(ingredients[18].value).toEqual('1/4 teaspoon sesame seeds');
});
*/
test('get ingredients from a food network recipe', async () => {
    const ingredients = await getIngredientsFromWebPage(foodNetworkHTML);
    expect(ingredients.length).toBe(9);
    expect(ingredients[0].value).toEqual('5 tablespoons chipotle powder');
    expect(ingredients[8].value).toEqual('Zest of 2 limes');
});
