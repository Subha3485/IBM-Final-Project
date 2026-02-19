const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Recipe = require("../models/Recipe");

dotenv.config();

const DATA = {
  "Paneer Butter Masala": { ingredients: ["paneer", "tomato puree", "butter", "cream", "kasuri methi", "garam masala"], instructions: "Saute spices in butter, add tomato gravy, simmer with paneer and finish with cream." },
  "Paneer Makhani": { ingredients: ["paneer", "tomatoes", "butter", "cream", "ginger garlic paste", "kashmiri chili"], instructions: "Cook rich tomato-butter gravy, add paneer cubes, and finish with cream." },
  "Dal Makhani": { ingredients: ["whole urad dal", "rajma", "butter", "cream", "tomatoes", "ginger garlic"], instructions: "Pressure-cook lentils, simmer slowly with butter and tomato masala until creamy." },
  "Chole Masala": { ingredients: ["chickpeas", "onion", "tomatoes", "chole masala", "ginger garlic", "amchur"], instructions: "Cook chickpeas in spicy onion-tomato gravy and simmer for deep flavor." },
  "Rajma Masala": { ingredients: ["kidney beans", "onion", "tomatoes", "ginger garlic", "cumin", "garam masala"], instructions: "Cook rajma and simmer in thick spiced tomato-onion gravy." },
  "Palak Paneer": { ingredients: ["spinach", "paneer", "onion", "tomato", "garlic", "cream"], instructions: "Blanch and blend spinach, cook masala, then add paneer and simmer." },
  "Aloo Gobi": { ingredients: ["potato", "cauliflower", "onion", "tomato", "turmeric", "cumin"], instructions: "Saute spices, add potato and cauliflower, cook covered until tender." },
  "Bhindi Masala": { ingredients: ["okra", "onion", "tomato", "coriander powder", "amchur", "green chili"], instructions: "Stir-fry okra separately, then toss with onion-tomato masala." },
  "Matar Paneer": { ingredients: ["paneer", "green peas", "onion", "tomato", "ginger garlic", "garam masala"], instructions: "Prepare gravy, add peas and paneer, and simmer until flavors combine." },
  "Kadhi Pakora": { ingredients: ["yogurt", "besan", "onion pakora", "turmeric", "curry leaves", "mustard seeds"], instructions: "Cook besan-yogurt kadhi, add fried pakoras, and temper with spices." },
  "Masala Dosa": { ingredients: ["dosa batter", "potatoes", "mustard seeds", "curry leaves", "green chili", "turmeric"], instructions: "Cook dosa till crisp, fill with spiced potato masala, and fold." },
  "Idli & Sambar": { ingredients: ["idli batter", "toor dal", "mixed vegetables", "tamarind", "sambar powder", "mustard seeds"], instructions: "Steam idli and serve with lentil-vegetable sambar." },
  "Veg Kurma": { ingredients: ["mixed vegetables", "coconut", "cashew", "onion", "tomato", "garam masala"], instructions: "Cook vegetables in coconut-cashew gravy with whole spices." },
  "Bisi Bele Bath": { ingredients: ["rice", "toor dal", "mixed vegetables", "tamarind", "bisi bele masala", "ghee"], instructions: "Cook rice-dal with vegetables and spice paste to one-pot consistency." },
  "Lemon Rice": { ingredients: ["cooked rice", "lemon juice", "mustard seeds", "peanuts", "curry leaves", "turmeric"], instructions: "Temper spices, toss with rice and lemon juice, and serve warm." },
  "Curd Rice": { ingredients: ["cooked rice", "curd", "milk", "mustard seeds", "curry leaves", "ginger"], instructions: "Mix rice with curd, temper mustard-curry leaves, and chill slightly." },
  Vada: { ingredients: ["urad dal", "ginger", "green chili", "curry leaves", "black pepper", "salt"], instructions: "Grind soaked dal, shape and deep-fry until crisp." },
  "Medu Vada": { ingredients: ["urad dal", "onion", "green chili", "curry leaves", "black pepper", "oil"], instructions: "Whisk dal batter, shape ring vadas, and deep fry golden." },
  "Veg Dum Biryani": { ingredients: ["basmati rice", "mixed vegetables", "yogurt", "biryani masala", "fried onions", "mint"], instructions: "Layer rice and vegetable masala, seal, and cook on dum." },
  "Hyderabadi Biryani": { ingredients: ["basmati rice", "chicken or mutton", "yogurt", "biryani masala", "fried onions", "saffron"], instructions: "Marinate meat, layer with rice and cook sealed on dum." },
  "Veg Pulao": { ingredients: ["basmati rice", "mixed vegetables", "whole spices", "ghee", "onion", "green peas"], instructions: "Saute spices and vegetables, then cook rice till fluffy." },
  "Jeera Rice": { ingredients: ["basmati rice", "cumin seeds", "ghee", "bay leaf", "salt", "water"], instructions: "Bloom cumin in ghee and cook basmati rice until aromatic." },
  Chapati: { ingredients: ["whole wheat flour", "water", "salt", "oil"], instructions: "Knead soft dough, roll thin, and cook on hot tawa." },
  Roti: { ingredients: ["whole wheat flour", "water", "salt"], instructions: "Knead dough, roll rotis, and roast on tawa till puffed." },
  Naan: { ingredients: ["maida", "yogurt", "yeast", "sugar", "salt", "butter"], instructions: "Proof dough, shape naans, and cook on hot tandoor/pan." },
  Paratha: { ingredients: ["whole wheat flour", "ghee", "salt", "water", "optional stuffing"], instructions: "Layer dough with ghee, roll and cook on tawa with ghee." },
  Poori: { ingredients: ["whole wheat flour", "semolina", "salt", "oil", "water"], instructions: "Knead tight dough, roll small discs, and deep-fry puffed." },
  Samosa: { ingredients: ["maida", "potatoes", "peas", "cumin", "garam masala", "oil"], instructions: "Fill pastry with spiced potato-pea mix and deep-fry." },
  "Pani Puri": { ingredients: ["puri shells", "boiled potatoes", "chickpeas", "mint water", "tamarind chutney", "chaat masala"], instructions: "Fill puris with potato mix and spicy tangy water." },
  Golgappa: { ingredients: ["puri shells", "potato", "black chana", "imli water", "mint", "chaat masala"], instructions: "Stuff golgappas and serve immediately with pani." },
  Dhokla: { ingredients: ["besan", "yogurt", "eno", "mustard seeds", "green chili", "curry leaves"], instructions: "Steam fermented batter, temper, and cut into squares." },
  "Aloo Tikki": { ingredients: ["potatoes", "cornflour", "green chili", "coriander", "chaat masala", "oil"], instructions: "Shape spiced potato patties and pan-fry crisp." },
  Pakora: { ingredients: ["besan", "onion or vegetables", "ajwain", "turmeric", "chili powder", "oil"], instructions: "Dip vegetables in batter and deep-fry until crisp." },
  Bhaji: { ingredients: ["onion", "besan", "green chili", "turmeric", "coriander", "oil"], instructions: "Mix onions with spiced gram flour batter and fry." },
  "Butter Chicken": { ingredients: ["chicken", "tomato puree", "butter", "cream", "kasuri methi", "garam masala"], instructions: "Cook grilled chicken in creamy tomato-butter gravy." },
  "Chicken Tikka Masala": { ingredients: ["chicken", "yogurt", "tomato puree", "onion", "cream", "garam masala"], instructions: "Grill marinated chicken, simmer in spiced tomato gravy." },
  "Rogan Josh": { ingredients: ["lamb", "yogurt", "onion", "kashmiri chili", "fennel", "whole spices"], instructions: "Slow-cook lamb with yogurt and aromatic Kashmiri spices." },
  "Goan Pork Vindaloo": { ingredients: ["pork", "vinegar", "garlic", "dry red chilies", "cumin", "onion"], instructions: "Marinate pork in vindaloo paste and slow-cook until tender." },
  "Chicken Chettinad": { ingredients: ["chicken", "onion", "tomato", "coconut", "fennel", "black pepper"], instructions: "Cook chicken in roasted Chettinad spice and coconut masala." },
  "Gulab Jamun": { ingredients: ["khoya", "maida", "baking soda", "sugar", "cardamom", "ghee"], instructions: "Fry dough balls and soak in warm cardamom sugar syrup." },
  Kheer: { ingredients: ["rice", "milk", "sugar", "cardamom", "almonds", "raisins"], instructions: "Slow-cook rice in milk and sweeten, garnish with nuts." },
  Jalebi: { ingredients: ["maida", "yogurt", "sugar", "saffron", "ghee", "lemon juice"], instructions: "Pipe fermented batter into oil and soak in syrup." },
  Rasmalai: { ingredients: ["chenna patties", "milk", "sugar", "cardamom", "saffron", "pistachio"], instructions: "Cook chenna discs and soak in reduced flavored milk." },
  "Kaju Katli": { ingredients: ["cashews", "sugar", "water", "ghee", "cardamom"], instructions: "Cook cashew paste with sugar syrup and set as thin slabs." },
  "Masala Chai": { ingredients: ["tea leaves", "milk", "water", "ginger", "cardamom", "sugar"], instructions: "Boil tea with spices, milk, and sugar; strain and serve." },
  Lassi: { ingredients: ["yogurt", "sugar or salt", "cardamom", "rose water", "ice"], instructions: "Blend yogurt with flavorings until frothy and chilled." },
  "Filter Coffee": { ingredients: ["filter coffee powder", "hot water", "milk", "sugar"], instructions: "Brew decoction in filter and mix with hot milk and sugar." },
};

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/cookly");
    let updated = 0;
    for (const [title, payload] of Object.entries(DATA)) {
      if (!payload) continue;
      const result = await Recipe.updateMany(
        { title: new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
        { $set: payload }
      );
      updated += result.modifiedCount || 0;
    }
    console.log(`Updated must-have ingredient content for ${updated} recipes.`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to fix must-have recipe content:", error.message);
    process.exit(1);
  }
}

run();
