const mongoose = require('mongoose');
const cities = require('./cities');
const hosel = require('../models/hostel');
const {names, descriptors} = require('./names');

mongoose.connect('mongodb://localhost:27017/hostel-db');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Hostel.deleteMany({});
    for (let i = 0; i < 10; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const hostel = new Hostel({
            author: '66707ed4d2087d5e508b1b4f',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${names[i]}`,
            description: `${descriptors[i]}`,
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png',
                    filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
                },
                {
                    url: 'https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png',
                    filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
                }
            ]
        })
        await hostel.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})