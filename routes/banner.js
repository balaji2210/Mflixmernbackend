const express = require("express");

const {
  createBanner,
  getBanners,
  updateBanner,
  getABanner,
  deleteBanner,
  trending,
} = require("../controllers/banner");
const { isLoggedIn, customRole } = require("../middlewares/user");

const router = express.Router();

router
  .route("/banner/create")
  .post(isLoggedIn, customRole("admin"), createBanner);

router.route("/banners").get(getBanners);

router
  .route("/banner/update/:id")
  .put(isLoggedIn, customRole("admin"), updateBanner);

router.route("/banner/:id").get(isLoggedIn, customRole("admin"), getABanner);

router
  .route("/banner/delete")
  .delete(isLoggedIn, customRole("admin"), deleteBanner);

router.route("/banners/trending").get(trending);

module.exports = router;
