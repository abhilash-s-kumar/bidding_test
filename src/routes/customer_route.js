const router = require('./auth_route');
const customerModel = require('../models/usersDB/customer');
const { authenticateToken } = require('../helpers/auth_helpers/jwt_helper');
const { isAlreadyRegistered } = require('../helpers/auth_helpers/customer_auth_helper');
const moment = require('moment-timezone');

// const path = require('path');

// search
router.get('/customer_search', authenticateToken, (req, res) => {
    console.log('/customer_search');
    //* Get query params
    const query = req.query.query ?? "";
    const limit = req.query.limit ?? "";
    console.log("body = " + req.query);
    let queryObject = {};


    // if (req.user['staffModelData']['department'] == 'super_admin') {
    //     queryObject = query ? { Name: { $regex: query, $options: 'i' } } : {};
    // } else {
    //     queryObject = query ? { Name: { $regex: query, $options: 'i' } } : {};
    // }

    if (query != "") {
        queryObject = {
            $or: [
                { Name: { $regex: query, $options: 'i' } },
                { 'addresses.loc': { $regex: query, $options: 'i' } },
                { mobile: { $regex: query, $options: 'i' } }
            ]
        };
        console.log("queryObject = " + JSON.stringify(queryObject));
    }
    const queryX = customerModel.find(queryObject).sort({ reg_date: -1 });

    if (limit !== "") {
        if (limit !== '') {
            const numericLimit = parseInt(limit, 10); // Convert limit to a numeric value
            queryX.limit(numericLimit);
        }
        
    }
    
    queryX.exec((err, result) => {
        if (err) {
            res.status(400).json({ error: err });
        } else {
            res.status(200).json({ result });
        }
    });
    // Add sort criteria for createdAt field in descending order
    // if (limit !== '') {
    //     customerModel.find(queryObject).sort({ reg_date: -1 }).limit(limit).exec((err, result) => {
    //         if (err) {
    //             console.log("err = ", err);
    //             res.status(400).json({ error: err });
    //         } else {
    //             res.status(200).json({ result });
    //         }
    //     });
    // } else {
    //     customerModel.find(queryObject).sort({ reg_date: -1 }).exec((err, result) => {
    //         if (err) {
    //             console.log("err = ", err);
    //             res.status(400).json({ error: err });
    //         } else {
    //             res.status(200).json({ result });
    //         }
    //     });
    // }

});

// Get customer by phone number
router.post('/customer_login/', (req, res) => {
    console.log('/customer/login/');
    isAlreadyRegistered(req.body).then((isRegistered) => {
        if (isRegistered) {
            //* Send OTP
            // sendOTP(req.body.mobile).then((result) => {
            //     res.status(200).json({ result, "is_registered": true });
            // }).catch((err) => {
            //     res.status(400).json({ error: err });
            // });
        } else {
            // sendOTP(req.body.mobile).then((result) => {
            //     res.status(200).json({ result, "is_registered": false });
            // }).catch((err) => {
            //     res.status(400).json({ error: err });
            // });
        }
    }).catch((err) => {
        res.status(400).json({ error: err });
    });

});

// Verify OTP
router.post('/customer_verify/', (req, res) => {
    console.log('/customer/verify/');
    console.log();
    // verifyOTP(req.body.otp_session_id, req.body.otp_entered_by_user).then((result) => {
    //     // Send customer details too
    //     customerModel.findOne({ mobile: req.body.mobile }).then((customer) => {
    //         console.log("customer = " + customer);
    //         if (req.body.mobile == '9999999999')
    //             result = true;
    //         res.status(200).json({ result, customer });
    //     }).catch((err) => {
    //         res.status(400).json({ error: err });
    //     });

    // }).catch((err) => {
    //     console.log(err);
    //     res.status(400).json({ error: err });
    // });
});

// update
router.post('/customer_update/', (req, res) => {
    console.log('/customer_update/ = ');
    // console.log('/customer_update/ = ' + JSON.stringify(req.body));
    customerModel.updateOne({ mobile: req.body.mobile }, { $set: req.body }).then((result) => {
        res.status(200).json({ result });
    }
    ).catch((err) => {
        res.status(400).json({ error: err });
    });
});

// Find an existing customer by mobile number
router.get('/customer_get/', (req, res) => {
    console.log('/customer_get/');
    customerModel.findOne({ mobile: req.query.mobile }).then((result) => {
        res.status(200).json({ result });
    }
    ).catch((err) => {
        res.status(400).json({ error: err });
    });
});

//New
router.post('/customer_new/', (req, res) => {
    console.log('/customer_new/');
    
    const cusCustomer = new customerModel(req.body);
    if (cusCustomer.id != null) {

        customerModel.findOneAndUpdate(
            { mobile: req.body.mobile },
            { $set: req.body },
            { new: true } // This option returns the modified document
        ).then((result) => {
            if (result) {
                res.status(200).json({ result });

            } else {
                res.status(404).json({ error: "Document not found" });
            }
        }).catch((err) => {
            res.status(400).json({ error: err });

        });
    } else {
        const newCustomer = new customerModel(req.body);
        newCustomer.id = newCustomer.mobile??newCustomer.ema;
        newCustomer.reg_date = moment().tz("Asia/Kolkata").format();
        newCustomer.save((err, result) => {
            if (err) {
                console.log("err = ", err);
                res.status(400).json({ error: err });
            } else {
                res.status(200).json({ result });
            }
        });
    }

});

module.exports = router;