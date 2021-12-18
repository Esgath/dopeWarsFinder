const express = require('express');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
// I don't know why but it seems opensea examples don't work, keep gettin Swagger errors.
// const sdk = require('api')('@opensea/v1.0#gbq4cz1cksxopxqw');
const db = require('./db')
const ItemModel = require('./models/item-model');

// Get provider api key
require('dotenv').config()

// import {abi, contractAdress};
const contractInfo = require("./data/contractInfo");

const Web3 = require("web3");
const Web3HttpProvider = require('web3-providers-http');

const app = express();
const port = process.env.PORT || 5000;

/* 
  * Function used to query data and update mongo database.
  * It checks for every item if it's claimed ($paper) based on lootid.
  * It's probably more efficient to check only ones that
  * have claimed set as 'false' rather that checking every
  * single item, but it's copy pasted code I've initialy written
  * for client side. Maybe I will update it idk since there won't be
  * more $paper airdrop?? 
*/
async function updateIsClaimedData() {
  myWeb3 = new Web3(createWeb3Provider());
  contractObj = getContractObj();
  let results = [];
  let i = 1;
  let keepCountOfLoot = 1;
  while (true) {
    results.push(checkIfClaimed(i, contractObj));
    if (results.length >= 100) {
      await Promise.allSettled(results).then(async function (results) {
        // keepCountOfLoot and max used to determine lootid
        for (let x = 0; x < 100; x++) {
          try {
            let response = await ItemModel.updateOne(
              {
                lootid: keepCountOfLoot
              },
              {
                $set: {
                  claimed: results[x].value
                }
              }
            ).then(res => console.log(res))
          } catch (error) {
            console.log(error);
          }
          keepCountOfLoot++;
        }
      });
      results = [];
    }
    if (i === 8000) {
      console.log("FINISHED")
      break;
    }
    i++;
  }

  // Check every 2 hours
  setTimeout(() => {
    updateIsClaimedData();
  }, 7200000);
}

async function checkIfClaimed(lootid, contractObj) {
  return contractObj.methods.claimedByTokenId(lootid).call();
}

function createWeb3Provider() {
  const options = {
      keepAlive: true,
      timeout: 20000,
  };
  return new Web3HttpProvider(process.env.WEB3_API, options);
}

function getContractObj() {
  contractObj =  new myWeb3.eth.Contract(contractInfo.abi, contractInfo.contractAdress);
  return contractObj;
}

updateIsClaimedData();
updateOpenSeaData();

async function updateOpenSeaData() {
  let offset = 50;
  while (offset <= 8000) {
    try {
      let data = await queryOpenSeaData(offset);
      for (let i = 0; i < data.assets.length; i++) {
        let item;
        // If sell_orders item isn't null - determine if item is listed 
        // && payment token is ETH - determine that it isn't an auction/offer 
        if (data.assets[i].sell_orders && data.assets[i].sell_orders[0].payment_token_contract.symbol === "ETH") {
          item = {token_id: Number(data.assets[i].token_id), price: Number(data.assets[i].sell_orders[0].current_price) / Math.pow(10, 18)};
        } else {
          // When loot isn't listed set price to 0. Do the same with auctions and offers.
          item = {token_id: Number(data.assets[i].token_id), price: 0};
        }
        let response = await ItemModel.updateOne(
          {
            lootid: item.token_id
          },
          {
            $set: {
              price: item.price
            }
          }
        ).then(res => console.log(res));
      }
    } catch (error) {
      console.log(error);
    }
    offset += 50;
  }

  // Check every 2 hours
  setTimeout(() => {
    updateOpenSeaData();
  }, 7200000);
}

async function queryOpenSeaData(offset) {
  try {
    const response = await fetch(`https://api.opensea.io/api/v1/assets?asset_contract_address=0x8707276df042e89669d69a177d3da7dc78bd8723&order_direction=desc&offset=${offset}&limit=50`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
}


app.use(express.json()) // for parsing application/json

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/api/get', async (req, res) => {
  // Get range of loot items based on lower and upper bound;
  const lowerBound = Number(req.query.lowerBound);
  const upperBound = Number(req.query.upperBound);

  const records = await ItemModel.find({
    lootid: {$gt: lowerBound-1, $lt: upperBound+1}
  })

  res.json(records);
});

app.listen(port, () => console.log(`Listening on port ${port}`));