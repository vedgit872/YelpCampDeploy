const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');// .. to goyelpcamp or root directory from the seed one 

mongoose.connect('mongodb://localhost:27017/yelp-camp'
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useUnifiedTopology: true
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '67e2e77d4b140b32c347f42c',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/ddywo3qx7/image/upload/v1743344158/YelpCamp/mxp01mjcnscwabljq6hm.jpg',
                    filename: 'YelpCamp/mxp01mjcnscwabljq6hm'
                },
                {
                    url: 'https://res.cloudinary.com/ddywo3qx7/image/upload/v1743341862/YelpCamp/pm0vugz3yosu5isg0jct.jpg',
                    filename: 'YelpCamp/pm0vugz3yosu5isg0jct'
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore magni doloribus soluta dolorem sapiente maxime numquam quo repellendus, ad pariatur? Repudiandae tempora autem atque odit ad natus dignissimos aperiam alias.',
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})

