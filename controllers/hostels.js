const Hostel = require('../models/hostel');
const { cloudinary } = require('../cloudinary');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res) => {
    const allHostels = await Hostel.find({});
    res.render('hostels/index', { allHostels });
};

module.exports.renderNewForm = async (req, res) => {
    res.render('hostels/new');
};

module.exports.create = async (req, res) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.hostel.location, { limit: 1 });
    const hostel = new Hostel(req.body.hostel);
    hostel.geometry = geoData.features[0].geometry;
    hostel.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    hostel.author = req.user._id;
    await hostel.save();
    req.flash('success', 'Successfully added a new hostel!');
    res.redirect(`/hostels/${hostel._id}`);
};


module.exports.show = async (req, res) => {
    const hostel = await Hostel.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!hostel) {
        req.flash('error', 'Hostel not found!');
        return res.redirect(`/hostels`);
    }
    res.render('hostels/show', {hostel});
};

module.exports.editForm = async (req, res) => {
    const {id} = req.params;
    const hostel = await Hostel.findById(id);
    if(!hostel) {
        req.flash('error', 'Hostel not found!');
        return res.redirect(`/hostels`);
    }
    res.render('hostels/edit', {hostel});
};

module.exports.edit = async(req, res ) => {
    const {id} = req.params;
    const hostel = await Hostel.findByIdAndUpdate(id, {...req.body.hostel});
    const geoData = await maptilerClient.geocoding.forward(req.body.hostel.location, { limit: 1 });
    hostel.geometry = geoData.features[0].geometry;
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    hostel.images.push(...imgs);
    await hostel.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
       await hostel.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    };
    req.flash('success', 'Successfully updated hostel!');
    res.redirect(`/hostels/${hostel._id}`);
};

module.exports.delete = async (req, res) => {
    const {id} = req.params;
    await Hostel.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted hostel!')
    res.redirect('/hostels');
};

