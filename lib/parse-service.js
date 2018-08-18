require('dotenv').config();
const axios = require('axios');


// Axios Client declaration

const api = axios.create({
  baseURL: process.env.PARSE_SERVERURL,
  params: {
   // access_key: process.env.API_KEY,
  },
  headers: {'X-Parse-Application-Id':  process.env.PARSE_APPID},
  timeout: process.env.TIMEOUT || 5000,
});

// Generic GET request function
const get = async (url) => {
  console.log(url);
  const response = await api.get(url);
  const { data } = response;
  if (data) {
    return data;
  }
  throw new Error(data.error.type);
};

// Generic POST request function
const post = async (url,requestdata) => {
    console.log(url);
    const response = await api.post(url,requestdata);
    const { data } = response;
    if (data) {
      return data;
    }
    throw new Error(data.error.type);
  };

module.exports = {
//  getRates: () => get(`/latest&symbols=${symbols}&base=EUR`),
    postHello: () => post(`/functions/hello`,'{}'),
    postTeam: async ({ team }) => {
        const response = await api.post('/classes/Team',{ team });
        const key = Object.keys(response.data)[0];
        const id  = response.data[key];
        console.log(id);
        return { objectId: id };
    },
    getTeams: async () => {
        const response = await api.get('/classes/Team');
        console.log("response");
        const { results } = response.data;
       // console.log({ results });
        if ( results ) {
           return { results };
        }
        throw new Error(results.error.type);
          },
};