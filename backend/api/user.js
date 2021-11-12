const express = require("express");
const multer = require('multer');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
let path = require('path');
const { permit } = require("../middleware/permissionRole");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'temp');
    },
    filename: function(req, file, cb) {   
        cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if(allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

let upload = multer({ storage, fileFilter });

// const {isAuth} = require('../middleware/verifyUser')
const userController = require("../controllers/UserController");
//CRUD
//router for get all users in system
router.get("/all", permit('admin'), userController.findAllUsers);
//router for get all users in system
router.get("/new", permit('admin'), userController.findNewUsers);
//route for get current user
router.get("/details", permit('user', 'admin'), userController.findUserByEmail);
//router for update user password with Id
router.patch("/edit/password", permit('user'), userController.updateUserPassword);
//router for update user info
router.patch("/edit", upload.single('avatar'), userController.updateUserInfo);
//router for get any user info with Id
router.get("/:userId", permit('user', 'admin'), userController.findUserById);





module.exports = router;
