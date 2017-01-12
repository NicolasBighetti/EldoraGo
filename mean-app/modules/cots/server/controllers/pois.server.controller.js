'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Poi = mongoose.model('Poi'),
  multer = require('multer'),
  crypto =require('crypto'),
  mime =require('mime'),
  config = require(path.resolve('./config/config')),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Poi
 */
exports.create = function (req, res) {
  var poi = new Poi(req.body);

  poi.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(poi);
    }
  });
};

/**
 * Show the current Poi
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var poi = req.poi ? req.poi.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  //poi.isCurrentUserOwner = req.user && poi.user && poi.user._id.toString() === req.user._id.toString();

  res.jsonp(poi);
};

/**
 * Update a Poi
 */
exports.update = function (req, res) {
  var poi = req.poi;

  poi = _.extend(poi, req.body);

  poi.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(poi);
    }
  });
};

/**
 * Delete an Poi
 */
exports.delete = function (req, res) {
  var poi = req.poi;

  poi.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(poi);
    }
  });
};

/**
 * List of Pois
 */
exports.list = function (req, res) {
  Poi.find().sort('-created').populate('user', 'displayName').exec(function (err, pois) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(pois);
    }
  });
};

/**
 * Poi middleware
 */
exports.poiByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Poi is invalid'
    });
  }

  Poi.findById(id).populate('user', 'displayName').exec(function (err, poi) {
    if (err) {
      return next(err);
    } else if (!poi) {
      return res.status(404).send({
        message: 'No Poi with that identifier has been found'
      });
    }
    req.poi = poi;
    next();
  });
};

/**
 * Update poi picture
 */
exports.changePoiPicture = function (req, res) {
  console.info('changePoiPicture');
  var message = null;

  //var upload = multer(config.uploads.profileUpload).single('newPoiPicture');

  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './app/images/uploads/');
    },
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        cb(null, raw.toString('hex') + Date.now() + '.' + mime.extension(file.mimetype));
      });
    }
  });

  var upload = multer({ storage: storage }).single('newPoiPicture');

  console.log(upload);

  var profileUploadFileFilter = require(path.resolve('./config/lib/multer')).profileUploadFileFilter;

  var poi = req.poi;

  console.log('upload poi');
  console.log(poi);
  console.log('upload file');
  console.log(req.file);

//  console.dir(req);


  // Filtering to upload only images
  upload.fileFilter = profileUploadFileFilter;

  if (poi) {
    upload(req, res, function (uploadError) {
      if (uploadError) {
        return res.status(400).send({
          message: 'Error occurred while uploading poi picture'
        });
      } else {
        poi.image = './images/uploads/' + req.file.filename;

        poi.save(function (saveError) {
          if (saveError) {
            return res.status(400).send({
              message: errorHandler.getErrorMessage(saveError)
            });
          } else {
            console.log('OK ! ' + poi);
            console.log('Filename' + req.file.filename);
            res.json(poi);
          }
        });
      }
    });
  }
  else {
    res.status(400).send({
      message: 'Poi not found'
    });
  }
};