const { Clerk } = require("@clerk/clerk-sdk-node");

const clerk = new Clerk({ secretKey: "sk_test_LiZ6nMtua9JfYx1fwVIAN4yy40sWvbKBbJjuobgimd" });

console.log("Clerk object:", clerk);
