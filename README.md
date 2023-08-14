# Northcoders News API

Welcome to my Northcoders Backend Project!

To follow along with me, you will need to do a few things before getting started.

Go to my online repository and create your own fork:
https://github.com/prgf87/nc-news-project

Then, navigate to your local directory and clone my repo by using the command below.

`git clone https://github.com/prgf87/nc-news-project`

Navigate into your newly cloned repo and use `code .` to launch VSCode.

Run `npm i` in your terminal to install all the necessary dependecies (make sure to navigate into your newly cloned folder before running this command!)

You will also have to create two .env files(.env.test & .env.development), one for test purposes, and one for the development/deployment stage.

.env.test example:
`PGDATABASE=nc_news_test`

The database that you will be interacting with will use the data inside the db folder and husky and other tests will make sure your app is fully functional.

Make sure you read through the files and data to introduce yourself to the project and understand the relationships between our data tables in psql.

Run the scripts included in the package.json to get up and running, in the following order:

`npm run setup-dbs`

`npm run seed`

`npm run prepare`

`npm test`

Thank you and good luck!
