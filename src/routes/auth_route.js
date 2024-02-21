const express = require('express')
const router = express.Router();
const { login, register } = require('../controllers/auth/auth_controller');
const { authenticateToken } = require('../helpers/auth_helpers/jwt_helper');

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

router.post('/customer_register', (req, res, next) => {
    console.log('/customer_register', req.body);
    register(req.body, next).then((data) => {
        // console.log("data = ", data);
        res.status(200).json(data)
    }).catch((error) => {
        console.log("error = ", error);
        res.status(400).json(error)
    })
});

module.exports = router;