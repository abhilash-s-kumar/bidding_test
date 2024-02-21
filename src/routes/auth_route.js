const express = require('express')
const router = express.Router();
const { login, register, getStaffs, deleteStaff } = require('../controllers/auth/auth_controller');
const { authenticateToken } = require('../helpers/auth_helpers/jwt_helper');

router.post('/staff_login', (req, res) => {
    console.log('/staff/login');
    login(req.body.password, req.body.phone, req.body.email)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => {
            console.log("error = ", error);
            res.status(400).json(error)
        })
});


// Used to register a new user
router.post('/staff_register', authenticateToken, (req, res, next) => {
    console.log('/staff_register', req.body);
    register(req.body, next).then((data) => {
        // console.log("data = ", data);
        res.status(200).json(data)
    }).catch((error) => {
        console.log("error = ", error);
        res.status(400).json(error)
    })
});


// Used to delete a staff
router.post('/staff_delete', authenticateToken, (req, res) => {
    console.log('/staff/delete');
    
    const { uid } = req.body;
    deleteStaff(uid).then((data) => {
        res.status(200).json({ result: data })
    }).catch((error) => {
        console.log ("error = ", error);
        res.status(400).json(error)
    })
});

// Get all staffs under a franchise (brid)
router.get('/staff_get', authenticateToken, (req, res) => {
    console.log('/staff/get');

    let query = {};
    // console.log("req.user = ", req.user);
    if (req.user['staffModelData']['department'] == 'super_admin') {
        query = {};
    }
    else {
        query = { "brid": req.user['staffModelData']['brid'] };
    }

    getStaffs(query).then((data) => {
        res.status(200).json({ result: data })
    }).catch((error) => {
        res.status(400).json(error)
    })
});


module.exports = router;