const mongoose = require("mongoose");

async function dbConnection(url) {
 await mongoose.connect(url);
}

module.exports={dbConnection};