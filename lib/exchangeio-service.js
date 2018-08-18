require('dotenv').config();
const axios = require('axios');

const symbols = process.env.SYMBOLS || 'BRL,USD,GBP';

// Axios Client declaration
const api = axios.create({
  baseURL: 'https://exchangeratesapi.io/api/',
  params: {
    access_key: process.env.API_KEY,
  },
  timeout: process.env.TIMEOUT || 5000,
});

// Generic GET request function
const get = async (url) => {
  console.log(url);
  const response = await api.get(url);
  const { data } = response;
  if (data.rates) {
    return data;
  }
  throw new Error(data.error.type);
};

module.exports = {
//  getRates: () => get(`/latest&symbols=${symbols}&base=EUR`),
    getRates: () => get(`/latest`),
    getHistoricalRate: date => get(`/${date}?symbols=${symbols}&base=EUR`),
};  