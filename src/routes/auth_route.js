const express = require('express')
const router = express.Router();
const { login, register } = require('../controllers/auth/auth_controller');
const { authenticateToken } = require('../helpers/auth_helpers/jwt_helper');

//API to login which will return JWT token as well as the userdata
router.post('/customer_login', (req, res) => {
    console.log('/customer_login');
    login(req.body.password, req.body.mobile, req.body.email)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => {
            console.log("error = ", error);
            res.status(400).json(error)
        })
});

//Registration happens here and the password will be hashed.
//Also this API will check the existence of the credentials in the DB.
router.post('/customer_register', (req, res, next) => {
    console.log('/customer_register', req.body);
    register(req.body, next).then((data) => {
        res.status(200).json(data)
    }).catch((error) => {
        console.log("error = ", error);
        res.status(400).json(error)
    })
});

module.exports = router;