import React, { useState, Component } from "react";

/*
 * Iterate through steps and determine which ingredient is used in each step
 * @param {Array} steps - Steps of dish
 * @param {Array} ingredients - Ingredients of dish
 * @Return {Promise}
 */

export const getIngredientsInSteps = async (steps, ingredients) => {
    try {
        let ingredientsInStepsArray = [];
        /* We are going to copy ingredients array so that when we insert info the dishInfo field we will use the 
	 * the orignal array instead of the one that is filtered */
        let ingredientsCopy = [...ingredients];
        let filteredIngredients = filterAllIngredients(ingredientsCopy);
        for (let stepNumber = 0; stepNumber < steps.length; stepNumber++) {
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
            ingredientsInStepsArray.push(ingredientsInEachStep);
        }
        return ingredientsInStepsArray;
    } catch (error) {
        return error;
    }
};

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
