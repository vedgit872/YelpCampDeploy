const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');
const camp = require('../controllers/campgrounds');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.get('/', catchAsync(camp.index));
router.get('/new', isLoggedIn, camp.renderNewForm);
router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync(camp.newForm));
// router.post('/', upload.array('image'), (req, res) => {
//     console.log(req.body, req.files);
//     res.send("It worked");
// });
router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(camp.editForm));
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(camp.delete));
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(camp.renderEditForm));
router.get('/:id', catchAsync(camp.show));
module.exports = router;