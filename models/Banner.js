const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
	{
		photo: {
			public_id: {
				type: String,
				required: true,
			},
			secure_url: {
				type: String,
				required: true,
			},
		},
		is_featured: {
			type: String,
			default: "true",
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
