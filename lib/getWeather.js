const fetch = require('node-fetch');
require('dotenv').config();

const getWeather = async(location=process.env.location, countryCode=process.env.countryCode) => {
    let data = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${location},${countryCode}&appid=${process.env.APPID}&units=metric`);
    return await data.json();
}

module.exports = getWeather;