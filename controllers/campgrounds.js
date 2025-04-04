const Campground = require('../models/campground');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const camps = await Campground.find({});
    res.render('campgrounds/index', { camps })
};
module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
};
module.exports.newForm = async (req, res) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    const camp = new Campground(req.body.campground);
    camp.geometry = geoData.features[0].geometry;
    camp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.author = req.user._id;
    await camp.save();
    console.log(camp);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${camp._id}`);
};
module.exports.editForm = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });//in res.body the compground object is destructured
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    camp.geometry = geoData.features[0].geometry;
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.images.push(...images);
    await camp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${camp._id}`)
};
module.exports.delete = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground');
    res.redirect('/campgrounds');
};
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { camp });
};
module.exports.show = async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!camp) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { camp });
};