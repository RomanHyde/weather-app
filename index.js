const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const getWeather = require('./lib/getWeather');
// NOT USING BODY PARSER THAT IS IN THE SLIDES
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.engine('hbs', hbs({
    defaultLayout:'main',
    extname:'.hbs',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials')
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');
app.get('/', async(req, res) => {
    let data = await getWeather();
    let name = data.name;
    let description = data.weather[0].description;
    let temp = data.main.temp;
    let feels_like = data.main.feels_like;
    res.render('index',{name, data:{description, temp, feels_like}});
});

app.get('/weather', (req, res) => {
    res.render('weather');
    console.log(req.body);
});

app.post('/weather', async(req,res) => {
    let location = req.bodylocation;
    let countryCode = req.body.countryCode;
    let data = await getWeather(location, countryCode);
    if (data.cod == '404'){
        res.render('weather', {
            err: 'The provided location doesn\'t exist'
        });
        return;
    }
    let name = data.name;
    let description = data.weather[0].description;
    let temp = data.main.temp;
    let feels_like = data.main.feels_like;
    // console.log(req.body);
    res.render('weather', {
        name,
        data: {description, temp, feels_like},
        listExists: true
    });
    // res.status(200).json(req.body);
});

app.get('*', (req, res) => {
    res.render('404');
});

app.listen(3000, () => {
    console.log('listening on port 3000');
});

