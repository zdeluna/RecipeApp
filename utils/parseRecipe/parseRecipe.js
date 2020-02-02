const request = require('request');
const cheerio = require('cheerio');
const {sendErrorResponse} = require('../../controllers/base.js');

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
            let headingHTML = await findHeading($, 'steps');
            console.log('HEADING: ' + headingHTML);
            stepsHTML = await findList(headingHTML);
            stepsHTML = await cleanList(stepsHTML);
            console.log('STEPS: ' + stepsHTML);

            stepsHTML
                .children('li') // Find the children of the list
                // Iterate through each child element and store the text of the element and add it to the array
                .each(function(index, element) {
                    let stepDescription = $(this)
                        .text()
                        .trim();
                    /* Remove step number if text already contained them.*/
                    stepDescription = removeNumberLabel(stepDescription);

                    /* Remove extra long whitepace*/
                    stepDescription = removeLongWhiteSpace(stepDescription);

                    let step = {id: stepsArray.length, value: stepDescription};
                    stepsArray.push(step);
                });
            resolve(stepsArray);
        } catch (error) {
            reject({
                statusCode: 422,
                msg: 'CANNOT_RETRIEVE_STEPS',
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

            let headingHTML = await findHeading($, 'ingredients');
            ingredientsHTML = await findList(headingHTML);
            ingredientsHTML = await cleanList(ingredientsHTML);

            ingredientsHTML
                .children() // Find the children of the list
                // Iterate through each child element and store the text of the element and add it to the array
                .each(function(index, element) {
                    let ingredientDescription = $(this)
                        .text()
                        .trim();
                    let ingredient = {
                        id: ingredientsArray.length,
                        value: ingredientDescription,
                    };
                    ingredientsArray.push(ingredient);
                });
            resolve(ingredientsArray);
        } catch (error) {
            reject({
                statusCode: 422,
                msg: 'CANNOT_RETRIEVE_INGREDIENTS',
            });
        }
    });
};

/**
 * Search through DOM for an unordered or orderlist list but investigating current node and traversing down the DOM tree if not found
 * @Return {Promise}
 */

const findList = async headingNode => {
    console.log('call find list');
    return new Promise(async (resolve, reject) => {
        let listElements = '';
        let listHTML = '';

        // First check the children of the heading node for text
        listElements = headingNode
            .children()
            .text()
            .trim();

        if (listElements != '') {
            console.log('Text in child node');
            console.log(listElements);
            console.log(listElements.length);
            return resolve(headingNode);
        }

        // First check the next sibling of heading node for text
        listElements = headingNode
            .next()
            .text()
            .trim();

        if (listElements != '') {
            console.log('Text in sibling node');
            return resolve(headingNode.next());
        }

        listElements = headingNode
            .parent()
            .next()
            .text();

        if (listElements != '') {
            resolve(headingNode.parent().next());
        }

        // Otherwise start from the parent of the heading node and traverse up to find an ordered or unordered list
        let searchHTML = headingNode;
        console.log('SEARCHING THROUGH TRAVERSING TREE');
        while (listElements == '') {
            searchHTML = searchHTML.parent();
            listElements = searchHTML.find('ul, ol');

            //If we make it to the top level without finding it, send back a reject
            if (searchHTML.initialize) {
                reject();
            }
        }
        resolve(listElements);
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
        let html = $('h1, h2, h3, h4, h5').filter(function() {
            if (heading == 'ingredients') {
                return checkForIngredientsHeading(
                    $(this)
                        .text()
                        .trim()
                        .toLowerCase(),
                );
            } else {
                return checkForStepsHeading(
                    $(this)
                        .text()
                        .trim()
                        .toLowerCase(),
                );
            }
        });

        if (html == '') {
            console.log('REJECT HEADING NOT FOUND');
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

        if (listHTML.find('ol, ul').children().length > 0) {
            listHTML = listHTML.find('ol, ul');
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
    text = text.replace(/:/gi, '');
    const acceptableStepsHeading = [
        'instructions',
        'directions',
        'preparation',
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
    text = text.replace(/:/gi, '');

    const acceptableIngredientsHeading = ['ingredients', 'ingredients:'];

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
    if (newText.substring(0, 4) == 'Step')
        newText = text.replace(/Step [0-9]/, '').trim();

    // Remove the number label in the format "1."
    newText = newText.replace(/^\d+\.\s*/, '');

    // Remove the number label in the format "1)"
    newText = newText.replace(/^\d+\)\s*/, '');

    return newText;
};

const removeLongWhiteSpace = text => {
    let newString = text.replace(/\s\s+/g, ' ');
    return newString;
};
