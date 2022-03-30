const express = require("express");
const {
  createMovie,
  updateMovie,
  deleteMovie,
  getAMovie,
  getMovies,
  getAMovieByCategory,
  addReview,
  deleteReview,
  getReviewsForMovie,
} = require("../controllers/move");
const { isLoggedIn, customRole } = require("../middlewares/user");

const router = express.Router();

router
  .route("/create/movie")
  .post(isLoggedIn, customRole("admin"), createMovie);

router
  .route("/movie/update/:id")
  .put(isLoggedIn, customRole("admin"), updateMovie);

router
  .route("/movie/delete/:id")
  .delete(isLoggedIn, customRole("admin"), deleteMovie);

router.route("/movie/:id").get(getAMovie);

router.route("/movies").get(getMovies);

router.route("/movie").get(getAMovieByCategory);

router.route("/review/:id").put(isLoggedIn, addReview);
router.route("/review").delete(isLoggedIn, deleteReview);
router.route("/reviews").get(getReviewsForMovie);

module.exports = router;
