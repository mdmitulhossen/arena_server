const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
// const multer = require('multer');


// For file Uploading
// const multerStorage = multer.diskStorage( {
//   destination: (req, file, cb) => {
//     cb(null, 'public/image/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image')) {
//     cb(null, true);
//   } else {
//     cb(new AppError('Not an Image. Please upload an image', 400), false);
//   }
// }

// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
// });
// File UPloading done...

// exports.uploadUserPhoto = upload.single('photo');

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const allUsers = await User.find();
    res.status(200).json ({
      status: 'success',
      results : allUsers.length,
      data : {
        allUsers,
      },
    });
});


exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password) {
    return next (
      new AppError('This route is not for password update. Please try the right route.', 400)
    );
  }

  const cur_user = await User.findById(req.user);

  if (req.body.name) cur_user.name = req.body.name;
  if (req.body.email) cur_user.email = req.body.email;
  if (req.body.photo) cur_user.photo = req.body.photo;

  const updatedUser = await cur_user.save();

  // const newObj = {
  //   name: req.body.name,
  //   email: req.body.email,

  // };

  // const updatedUser = await User.findByIdAndUpdate(req.user.id, newObj, {
  //   new : true, 
  //   runValidators : true,
  // })

  res.status(200).json({
    status: "Success.",
    data: updatedUser,
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError(`No user found with id : ${req.params.id}`, 404));
  }
  
  res.status(200).json({
    status:'Success',
    message: "User Found XD",
    user,
  });
})

exports.getMe = (req, res, next) => {
  const { user } = req;
  user.password = undefined;
  console.log(user);

  res.status(200).json({
    status: 'success',
    user,
  });
}

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No User Found with that id!', 404));
  }

  res.status(200).json({
    status: 'Success',
    message : "Succesfully Deleted User",
    data : null,
  });

});

