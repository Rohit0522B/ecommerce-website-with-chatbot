const levenshteinDistance = require("./utils/stringUtils.cjs");
const buildKnowledgeBase = require("./utils/buildKnowledge.cjs");
const classifyIntent = require("./utils/classifyIntent.cjs");

console.log("--- Testing Levenshtein Distance ---");
console.log("Difference between 'kitten' and 'sitting':", levenshteinDistance("kitten", "sitting")); // Should be 3
console.log("Difference between 'sndblst' and 'soundblast':", levenshteinDistance("sndblst", "soundblast")); // Should be smallish

console.log("\n--- Testing Intent Classification ---");
console.log("'suggest headphones under 3000':", classifyIntent(["suggest", "headphones", "under", "3000"]));
console.log("'price of SoundBlast':", classifyIntent(["price", "soundblast"]));

console.log("\n--- Testing Knowledge Base Loading ---");
const kb = buildKnowledgeBase();
console.log("Loaded", kb.length, "products.");
console.log("Sample product:", kb[0]);

console.log("\n--- Testing Fuzzy Match Logic (Simulation) ---");
const query = "sndblst";
const fuzzyMatches = kb.filter(item => {
    const dist = levenshteinDistance(query, item.title.toLowerCase());
    return dist <= 3;
});
console.log(`Matches for '${query}':`, fuzzyMatches.map(m => m.title));

console.log("\n--- Testing Recommendation Logic (Simulation) ---");
const intent = "recommendation";
const message = "suggest headphones under 3000";
const keywords = ["suggest", "headphones", "under", "3000"];
const budgetMatch = message.match(/\d+/);
const budget = budgetMatch ? parseInt(budgetMatch[0]) : Infinity;
let category = "headphones"; // Simplified extraction for test

const results = kb.filter((item) => {
    const isProduct = item.type === "product";
    const matchesCategory = category ? item.category === category : true;
    const withinBudget = item.price <= budget;
    return isProduct && matchesCategory && withinBudget;
});
results.sort((a, b) => b.rating - a.rating);

const response = {
    text: results.slice(0, 3).map((r) => r.content).join("\n\n"),
    products: results.slice(0, 3) // formatting matches reasoningEngine
};

console.log(`Recommendations for '${message}':`);
console.log("Text:", response.text);
console.log("Products:", response.products.map(p => `${p.title} [${p.images ? p.images[0] : 'No Image'}]`));
