require('dotenv').config();
const axios = require('axios');

const symbols = require('./symbols.json');

// Axios Client declaration
const api = axios.create({
  timeout: process.env.TIMEOUT || 5000,
});

// Generic GET request function
const get = async (url) => {
  if (symbols) {
    return symbols;
  }
  throw new Error(data.error.type);
};

module.exports = {
    getSymbols: () => get('/symbols'),
};