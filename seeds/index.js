const mongoose = require('mongoose');
const Hostel = require('../models/hostel');
const cities = require('./cities');
const {names, description}  = require('./names');
mongoose.connect('mongodb://localhost:27017/hostel-db');

const db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Hostel.deleteMany({});
    for (let i = 0; i < 30; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 40) + 11;
        const camp = new Hostel({
            author: '66707ed4d2087d5e508b1b4f',
            title: names[i],
            price: price,
            images: [
                {
                  url: 'https://res.cloudinary.com/dfvc1kjvh/image/upload/v1719140498/HostelDB/j0vg3v8o2awsjtgsqjvm.jpg',
                  filename: 'HostelDB/j0vg3v8o2awsjtgsqjvm',
                }
              ],
            description: description[i],
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            geometry: {
              type: 'Point',
              coordinates: [
                cities[random1000].longitude,
                cities[random1000].latitude
               ]
            }
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});