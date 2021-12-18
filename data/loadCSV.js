// https://medium.com/nonstopio/import-csv-file-data-into-mongodb-database-using-node-js-bb21afdebc31

// Import required module csvtojson and mongodb packages
const csvtojson = require('csvtojson');
const mongodb = require('mongodb');

var url = "mongodb://localhost:27017/DopeWars";

var dbConn;
mongodb.MongoClient.connect(url, {
    useUnifiedTopology: true,
}).then((client) => {
    console.log("DB Connected!");
    dbConn = client.db();
}).catch(err => {
    console.log("DB Connection Error: ${err.message}");
});

// CSV file name
const fileName = "./data/dopeRarity.csv";
var arrayToInsert = [];
csvtojson().fromFile(fileName).then(source => {
    for (var i = 0; i < source.length; i++) {
         var oneRow = {
             lootid: Number(source[i]["lootid"]),
             score: Number(source[i]["score"]),
             rare: Number(source[i]["rare"]),
         };
         arrayToInsert.push(oneRow);
     }
     //inserting into the table "dopeRarity"
     var collectionName = "DopeWars";
     var collection = dbConn.collection(collectionName);
     collection.insertMany(arrayToInsert, (err, result) => {
         if (err) console.log(err);
         if(result){
             console.log("Import CSV into database successfully.");
         }
     });
});