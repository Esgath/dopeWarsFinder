const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    lootid: {type: Number},
    score: {type: Number},
    rare: {type: Number},
    claimed: {type: Boolean},
    price: {type: Number}

},
{
    collection:"DopeWars"
});
model = mongoose.model("ItemModel", ItemSchema);

module.exports = model;