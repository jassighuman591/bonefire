require('dotenv').config()

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const MONGO_URL = process.env.DB_URL;

mongoose.connect(MONGO_URL ,{
    useNewUrlParser : true, 
    useUnifiedTopology : true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error!!!"));
db.once("open", () => {
    console.log("Database Conncted");
})


const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //YOUR USER ID
            author: '62ff624c448d694cb1104264',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price,
            geometry:{
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dqokqitzc/image/upload/v1667019152/Bonefire/y64qho1xw204uorgiwiy.jpg',
                    filename: 'Bonefire/g92pfsa0n3fi7grkplcu'
                },
                {
                    url: 'https://res.cloudinary.com/dqokqitzc/image/upload/v1667104837/Bonefire/twwuhfvntuvzqume5gdu.jpg',
                    filename: 'Bonefire/twwuhfvntuvzqume5gdu'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})