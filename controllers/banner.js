const Banner = require("../models/Banner");
const BigPromise = require("../middlewares/Bigpromise");

const cloudinary = require("cloudinary").v2;
exports.createBanner = BigPromise(async (req, res, next) => {
	let image = {};
	let result;
	if (req.files) {
		result = await cloudinary.uploader.upload(
			req.files.photo.tempFilePath,
			{
				folder: "banner",
			}
		);
	}
	image.public_id = result.public_id;
	image.secure_url = result.secure_url;

	req.body.photo = image;
	req.body.user = req.user._id;

	const banner = await Banner.create(req.body);

	res.status(200).json({
		success: true,
		banner,
	});
});

exports.getABanner = BigPromise(async (req, res, next) => {
	const banner = await Banner.findById(req.params.id);

	if (!banner) {
		return res.status(400).json({
			success: true,
			message: "No Banner found with Id",
		});
	}

	return res.status(200).json({
		success: true,
		banner,
	});
});

exports.getBanners = BigPromise(async (req, res, next) => {
	const banners = await Banner.find();

	if (!banners) {
		return res.status(400).json({
			success: true,
			message: "No Banner found with Id",
		});
	}

	return res.status(200).json({
		success: true,
		banners,
	});
});

exports.updateBanner = BigPromise(async (req, res, next) => {
	let banner = await Banner.findById(req.params.id);

	if (!banner) {
		return res.status(400).json({
			success: true,
			message: "No Banner found with Id",
		});
	}

	// let image = {};
	// let result;

	// if (req.files) {
	//   await cloudinary.uploader.destroy(banner.image.public_id);

	//   result = await cloudinary.uploader.upload(req.files.photo.tempFilePath, {
	//     folder: "banner",
	//   });

	//   image.public_id = result.public_id;
	//   image.secure_url = result.secure_url;
	//   req.body.photo = image;
	// }

	// banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
	//   new: true,
	//   runValidators: true,
	//   useFindAndModify: false,
	// });

	if (banner.is_featured === "true") {
		banner.is_featured = "false";
	} else {
		banner.is_featured = "true";
	}

	await banner.save();

	return res.status(200).json({
		success: true,
		banner,
	});
});

exports.deleteBanner = BigPromise(async (req, res, next) => {
	const banner = await Banner.findById(req.query.id);

	await cloudinary.uploader.destroy(banner.photo.public_id);

	await Banner.findByIdAndDelete(req.query.id);

	return res.status(200).json({
		success: true,
		message: "Banner Deleted",
	});
});

exports.getTrending = BigPromise(async (req, res, next) => {
	let banners = await Banner.find();

	if (!banners) {
		return res.status(400).json({
			success: true,
			message: "No Banner found with Id",
		});
	}

	banners = banners.filter((ban) => {
		return ban.is_featured !== "false";
	});

	return res.status(200).json({
		success: true,
		banners,
	});
});
