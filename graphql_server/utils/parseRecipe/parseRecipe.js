const cheerio = require("cheerio");

/**
 * Parse through a web page and store the steps of the recipe
 * @param {String} $ - Represents the html contents of a page
 * @Return {Promise}
 */

exports.getStepsFromWebPage = async $ => {
    return new Promise(async (resolve, reject) => {
        try {
            let stepsArray = [];
            // Find the heading that contains instruction
            let headingHTML = await findHeading($, "steps");
            stepsHTML = await findList(headingHTML, $);
            stepsHTML = await cleanList(stepsHTML);
            stepsHTML
                .children("li") // Find the children of the list
                // Iterate through each child element and store the text of the element and add it to the array
                .each(function(index, element) {
                    let stepDescription = $(this)
                        .text()
                        .trim();
                    /* Remove step number if text already contained them.*/
                    stepDescription = removeNumberLabel(stepDescription);

                    /* Remove extra long whitepace*/
                    stepDescription = removeLongWhiteSpace(stepDescription);

                    /* Allrecipes has the word 'advertisement' at the end of each step*/
                    stepDescription = removeAdvertisement(stepDescription);
                    stepsArray.push(stepDescription);
                });
            resolve(stepsArray);
        } catch (error) {
            reject({
                statusCode: 422,
                msg: "CANNOT_RETRIEVE_STEPS"
            });
        }
    });
};

/**
 * Parse through a web page and store the ingredients of the recipe
 * @param {String} $ - Represents the html contents of a page
 * @Return {Promise}
 */

exports.getIngredientsFromWebPage = async $ => {
    return new Promise(async (resolve, reject) => {
        try {
            let ingredientsArray = [];
            let ingredientsHTML;
            let ingredientsType = "";
            let headingHTML = await findHeading($, "ingredients");
            ingredientsHTML = await findList(headingHTML, $);

            if (ingredientsHTML.length) {
                ingredientsHTML = await cleanList(ingredientsHTML);
                ingredientsType = "li";
            } else {
                console.log("Did not find list");
                ingredientsHTML = await findElements(headingHTML, $);
                ingredientsType = "p";
            }

            ingredientsHTML
                .children(ingredientsType) // Find the children of the list
                // Iterate through each child element and store the text of the element and add it to the array
                .each(function(index, element) {
                    let ingredientDescription = $(this)
                        .text()
                        .trim();
                    ingredientsArray.push(ingredientDescription);
                });
            resolve(ingredientsArray);
        } catch (error) {
            reject({
                statusCode: 422,
                msg: "CANNOT_RETRIEVE_INGREDIENTS"
            });
        }
    });
};

/*
 * Iterate through steps and determine which ingredient is used in each step
 * @param {Array} steps - Steps of dish
 * @param {Array} ingredients - Ingredients of dish
 * @Return {Promise}
 */

exports.getIngredientsInSteps = (steps, ingredients) => {
    try {
        let ingredientsInStepsArray = [];
        /* We are going to copy ingredients array so that when we insert info the dishInfo field we will use the 
	 * the orignal array instead of the one that is filtered */
        //let ingredientsCopy = ingredients.map(a => Object.assign({}, a));
        let filteredIngredients = filterAllIngredients(ingredients);
        for (let stepNumber = 0; stepNumber < steps.length; stepNumber++) {
            let ingredientsStepObject = {};
            ingredientsStepObject.step = stepNumber;
            let ingredientsInEachStep = [];
            let stepDescription = steps[stepNumber].toLowerCase();

            for (
                let ingredientNumber = 0;
                ingredientNumber < filteredIngredients.length;
                ingredientNumber++
            ) {
                let ingredientDescription =
                    filteredIngredients[ingredientNumber];
                if (stepHasIngredient(stepDescription, ingredientDescription)) {
                    ingredientsInEachStep.push(ingredients[ingredientNumber]);
                }
            }
            ingredientsStepObject.ingredients = ingredientsInEachStep;
            ingredientsInStepsArray.push(ingredientsStepObject);
        }
        return ingredientsInStepsArray;
    } catch (error) {
        console.log("ERROR");
        console.log(error.msg);
        return error;
    }
};

/**
 * Search through DOM for an unordered or orderlist list but investigating current node and traversing down the DOM tree if not found
 * @Return {Promise}
 */

const findList = async (node, $) => {
    return new Promise(async (resolve, reject) => {
        let listHTML;
        const MAX_LEVELS = 5;
        let currentLevel = 0;

        while (currentLevel < MAX_LEVELS) {
            listHTML = node.find("ul, ol");

            if (listHTML.length) {
                return resolve(listHTML);
            }
            node = node.parent();
            currentLevel += 1;
        }
        return resolve(false);
    });
};

/**
 * Parse through a web page and find <p> elements. Used in case <ul> and <ol> are not found.
 * @param {String} node - The starting node to begin traversing
 * @param {String} $ - Represents the html contents of a page
 * @Return {Promise containing parent node}
 */

const findElements = async (node, $) => {
    return new Promise(async (resolve, reject) => {
        let listHTML;
        const MAX_LEVELS = 5;
        let currentLevel = 0;
        let numElements;

        while (currentLevel < MAX_LEVELS) {
            listHTML = node.find("p");

            if (listHTML.length >= 3) {
                return resolve(listHTML.parent());
            }
            node = node.parent();
            currentLevel += 1;
        }
        return resolve(false);
    });
};

/*
* Return the html that contains "Ingredients" or "Steps/Instructions/Directions"
* @param {String} $ - html to search
* @param {String} heading - the type of heading to search for such "ingredients"
 * @Return {Promise containing the html}
 */

const findHeading = async ($, heading) => {
    return new Promise(async (resolve, reject) => {
        let html = $("h1, h2, h3, h4, h5").filter(function() {
            if (heading == "ingredients") {
                return checkForIngredientsHeading(
                    $(this)
                        .text()
                        .trim()
                        .toLowerCase()
                );
            } else {
                return checkForStepsHeading(
                    $(this)
                        .text()
                        .trim()
                        .toLowerCase()
                );
            }
        });

        if (html == "") {
            console.log("HEADING " + heading + " NOT FOUND");
            reject();
        }

        resolve(html);
    });
};

/**
 * Check to make sure list html is referring to the most nested list
 * @param {String} listHTML - The html of the contents after the "Instructions" or "Ingredients" heading
 * @Return {Promise}
 */

const cleanList = async listHTML => {
    return new Promise(async (resolve, reject) => {
        /* Check to make sure we are searching through most nested ordered list or unordered list.
		 * If we are not, then return the nested ordered or unordered list */

        if (listHTML.find("ol, ul").children().length > 0) {
            listHTML = listHTML.find("ol, ul");
        }
        resolve(listHTML);
    });
};

/**
 * Check to see if the passed in text is a possible heading for steps
 * @param {String} text
 * @Return {boolean}
 */

const checkForStepsHeading = text => {
    // Remove semicolon
    text = text.replace(/:/gi, "");
    const acceptableStepsHeading = [
        "instructions",
        "directions",
        "preparation"
    ];

    if (acceptableStepsHeading.indexOf(text) > -1) {
        return true;
    } else {
        return false;
    }
};

/**
 * Check to see if the passed in text is a possible heading for ingredients
 * @param {String} text
 * @Return {boolean}
 */

const checkForIngredientsHeading = text => {
    // Remove semicolon
    text = text.replace(/:/gi, "");

    const acceptableIngredientsHeading = ["ingredients", "ingredients:"];

    if (acceptableIngredientsHeading.indexOf(text) > -1) {
        return true;
    } else return false;
};

/**
 * Remove the number labels in a text such as "1." or "1)"
 * @param {String} text - The text containing the number label
 * @Return {String}
 */

const removeNumberLabel = text => {
    // Remove the "Step" label if the step description begins with Step #.
    let newText = text;
    if (newText.substring(0, 4) == "Step")
        newText = text.replace(/Step [0-9]/, "").trim();

    // Remove the number label in the format "1."
    newText = newText.replace(/^\d+\.\s*/, "");

    // Remove the number label in the format "1)"
    newText = newText.replace(/^\d+\)\s*/, "");

    return newText;
};

/**
 * Remove long white space that comes before or after a string.
 * @param {String} text - The text that contains the extra whitespace
 * @Return {String}
 */

const removeLongWhiteSpace = text => {
    let newString = text.replace(/\s\s+/g, " ");
    return newString;
};

/**
 * Remove the word advertisement from text.
 * @param {String} text - The text that contains the word 'advertisement'
 * @Return {String}
 */

const removeAdvertisement = text => {
    return text.replace(/Advertisement/, "").trim();
};

/**
 * Return True if ingredient is found in step, otherwise return False
 * @param {String} step
 * @param {String} ingredient
 * @Return {Boolean}
 */

function stepHasIngredient(step, ingredient) {
    let ingredientBrokenIntoWordsArray = ingredient.split(" ");

    for (var i = 0; i < ingredientBrokenIntoWordsArray.length; i++) {
        let ingredientWord = ingredientBrokenIntoWordsArray[i];

        /* Ignore all strings of length 1 */
        if (ingredientWord.length == 1) continue;
        if (step.includes(ingredientWord)) {
            return true;
        }
    }

    return false;
}

/**
 * Store an array of the filtered ingredients
 * * @param {Array} ingredients array
 * @Return {Array}filtered ingredients array
 */

function filterAllIngredients(ingredientsArray) {
    try {
        let filteredIngredientsArray = [];
        for (let i = 0; i < ingredientsArray.length; i++) {
            filteredIngredientsArray.push(
                filterIngredient(ingredientsArray[i])
            );
        }
        return filteredIngredientsArray;
    } catch (error) {
        return error;
    }
}

/**
 * Filter through ingredient string and remove words not used when searching through recipe steps in order to pair
 * ingredients with steps
 * @param {String} ingredient
 * @Return {String} filtered ingredient
 */

function filterIngredient(ingredient) {
    // Remove the quantity measurement from ingredient
    ingredient = ingredient.replace(
        /cup|tablespoon|teaspoon|gram|pounds| g | c | ml | oz |ounce|ml/gi,
        ""
    );

    // Remove the numbers from ingredient
    ingredient = ingredient.replace(/[0-9]/g, "");

    // Remove '() and / 'from ingredient
    ingredient = ingredient
        .replace(/"/g, "")
        .replace(/'/g, "")
        .replace(/\(|\)/g, "")
        .replace(/\//g, "");

    // Remove some common words
    ingredient = ingredient.replace(/\band\b/gi, "");
    ingredient = ingredient.replace(/\bor\b/gi, "");
    ingredient = ingredient.replace(/\bfor\b/gi, "");
    ingredient = ingredient.replace(/\bthe\b/gi, "");

    // Remove all text after a comma
    ingredient = ingredient.replace(/\,.*/, "");

    // Remove all text after a semicolon
    ingredient = ingredient.replace(/\;.*/, "");

    // Replace all double spaces with single spaces
    ingredient = ingredient.replace(/  /g, " ");

    // Change all letters to lowercase
    ingredient = ingredient.toLowerCase();

    // Remove the white space before and after the word
    ingredient = ingredient.trim();

    return ingredient;
}
