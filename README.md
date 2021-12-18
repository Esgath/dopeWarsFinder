# dopeWarsFinder

It's just a project to learn some web3js. It allows to find dope wars nfts with unclaimed paper and fetch their price from openSea (using OS api).
It has mongoDB database. Before running it you need to run loadCSV.js that loads all items and rarities.
Then created DB is used further to update other properties. Server updates DB every 2hr.
In base dir .env is required with WEB3_API set to api key eg. INFURA, ALCHEMIST.