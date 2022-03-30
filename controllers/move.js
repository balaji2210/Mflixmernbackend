const Movie = require("../models/Movie");

const BigPromise = require("../middlewares/Bigpromise");
const cloudinary = require("cloudinary").v2;

exports.createMovie = BigPromise(async (req, res, next) => {
  let result;
  let image = {};
  if (req.files) {
    result = await cloudinary.uploader.upload(req.files.photo.tempFilePath, {
      folder: "movie",
    });
  }

  image.public_id = result.public_id;
  image.secure_url = result.secure_url;
  req.body.photo = image;
  req.body.user = req.user.id;

  const movie = await Movie.create(req.body);

  return res.status(200).json({
    success: true,
    movie,
  });
});

exports.updateMovie = BigPromise(async (req, res, next) => {
  let movie = await Movie.findById(req.params.id);

  if (!movie) {
    return res.status(400).json({
      message: "NO Movie found",
    });
  }

  let result;
  let image = {};

  if (req.files) {
    await cloudinary.uploader.destroy(movie.photo.public_id);

    result = await cloudinary.v2.uploader.upload(req.files.photo.tempFilePath, {
      folder: "movie",
    });

    image.public_id = result.public_id;
    image.secure_url = result.secure_url;
    req.body.photo = image;
  }

  movie = await Movie.findById(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  return res.status(200).json({
    success: true,
    movie,
  });
});

exports.getMovies = BigPromise(async (req, res, next) => {
  const whereClause = new WhereClause(Movie, req.query).search();

  const movies = await whereClause.bigQ;

  res.status(200).json({
    success: true,
    movies,
  });
});

exports.getAMovie = BigPromise(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    return res.status(400).json({
      message: "No movie Found",
    });
  }
  return res.status(200).json({
    success: true,
    movie,
  });
});

exports.deleteMovie = BigPromise(async (req, res, next) => {
  let movie = await Movie.findById(req.params.id);

  if (!movie) {
    return res.status(200).json({
      message: "No Movie found",
    });
  }

  await cloudinary.uploader.destroy(movie.photo.public_id);

  await Movie.findByIdAndDelete(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Movie Deleted",
  });
});

exports.addReview = BigPromise(async (req, res, next) => {
  const { rating, comment } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const movie = await Movie.findById(req.params.id);

  const ALreadyReview = movie.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (ALreadyReview) {
    movie.reviews.forEach((review) => {
      if (review.user.toString() === req.user._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    movie.reviews.push(review);
    movie.noOfReviews = movie.reviews.length;
  }

  //adjust ratings
  movie.ratings =
    movie.reviews.reduce((acc, item) => item.rating + acc, 0) /
    movie.noOfReviews;

  await movie.save({ validateBeforeSave: false });

  return res.status(200).json({
    success: true,
    message: "added review",
  });
});

exports.deleteReview = BigPromise(async (req, res, next) => {
  const { id } = req.query;

  const movie = await Movie.findById(id);

  let reviews = movie.reviews.filter(
    (rev) => rev.user.toString() !== req.user._id.toString()
  );

  let noOfReviews;

  //updtae movie
  let total = 0;
  let ratings;

  if (reviews.length === 0) {
    (noOfReviews = 0), (ratings = 0);
  } else {
    noOfReviews = reviews.length;
    ratings = reviews.map((rev) => {
      total = total + rev.rating;
    });
    ratings = total / noOfReviews;
  }

  await Movie.findByIdAndUpdate(
    id,
    {
      reviews,
      ratings,
      noOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

exports.getReviewsForMovie = BigPromise(async (req, res, next) => {
  const movie = await Movie.findById(req.query.id);

  res.status(200).json({
    success: true,
    reviews: movie.reviews,
  });
});

exports.getAMovieByCategory = BigPromise(async (req, res, next) => {
  const { category } = req.query;
  const movies = await Movie.find({ category: category });

  if (!movies) {
    return res.status(200).json({
      message: "No Movie found",
    });
  }

  return res.status(200).json({
    success: true,
    movies,
  });
});
