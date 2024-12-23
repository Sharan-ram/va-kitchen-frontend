import mongoose from "mongoose";
import Recipe from "../../models/Recipe.js";
import Ingredient from "../../models/Ingredient.js";
import dotenv from "dotenv";
dotenv.config();

const migrateRecipeIngredients = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

    // Fetch all recipes
    const recipes = await Recipe.find().lean();

    // console.log({ recipe: JSON.stringify(recipes) });

    for (const recipe of recipes) {
      const updatedIngredients = [];

      for (const ingredient of recipe.ingredients) {
        // Fetch the Ingredient using the existing ingredient ID (instead of name)
        // console.log({ ingredient, recipe });
        const ingredientDoc = await Ingredient.findOne({
          name: ingredient.ingredient.name,
        });

        if (!ingredientDoc) {
          // If the ingredient doesn't exist, create it (optional)
          console.log("Ingredient not found", ingredient.name);
          //   const newIngredient = new Ingredient({
          //     name: ingredient.ingredient.name,
          //     // Add the other necessary fields for the ingredient
          //   });

          //   await newIngredient.save(); // Save the new ingredient to the database
          //   updatedIngredients.push({
          //     ingredient: newIngredient._id,
          //     summerQuantity: ingredient.summerQuantity,
          //     winterQuantity: ingredient.winterQuantity,
          //     monsoonQuantity: ingredient.monsoonQuantity,
          //     retreatQuantity: ingredient.retreatQuantity,
          //   });
        } else {
          // If the ingredient exists, just push the existing ingredient reference
          updatedIngredients.push({
            ingredient: ingredientDoc._id,
            summerQuantity: ingredient.summerQuantity,
            winterQuantity: ingredient.winterQuantity,
            monsoonQuantity: ingredient.monsoonQuantity,
            retreatQuantity: ingredient.retreatQuantity,
          });
        }
      }

      //   console.log({
      //     // updatedIngredients: JSON.stringify(updatedIngredients),
      //     recipe: recipe.name,
      //   });

      // Update the recipe with the new ingredients (using references)
      recipe.ingredients = updatedIngredients;

      //   Save the updated recipe
      await Recipe.findByIdAndUpdate(recipe._id, {
        ingredients: updatedIngredients,
      });

      console.log(`${recipe.name} updated successfully`);
    }

    console.log("Recipes migration completed.");
  } catch (error) {
    console.error("Error migrating recipe ingredients:", error);
  } finally {
    mongoose.connection.close(); // Close the connection
  }
};

migrateRecipeIngredients();
