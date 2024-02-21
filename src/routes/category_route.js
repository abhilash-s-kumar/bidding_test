const router = require('./auth_route');
var categoryModel = require('../models/usersDB/category');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('../helpers/auth_helpers/jwt_helper');

//both add and update based on the existence of the uid.
router.post('/add_category', authenticateToken, async (req, res) => {
    console.log('/add_category');
    try {
        categoryModel = await categoryModel;

        var { uid, name, description, image } = req.body;
        if (uid) {
            const updatedItem = await categoryModel.findOneAndUpdate({ "uid": uid }, { uid, name, description, image });
            res.status(200).json({ result: updatedItem });
        } else {
            const uid = uuidv4();
            const newItem = new categoryModel({ uid, name, description, image });
            const savedItem = await newItem.save();
            res.status(200).json({ result: savedItem });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});

//only disables the item, doesnt delete permanently.
router.post('/delete_category', authenticateToken, async (req, res) => {
    console.log('/delete_category');
    try {
        categoryModel = await categoryModel;

        const { uid } = req.body;
        if (uid) {
            await categoryModel.findOneAndDelete({ "uid": uid });
            res.status(200).json({ result: true });
        } else {
            res.status(400).json({ message: 'Invalid UID received' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});

//get active/non-disabled items.
router.get('/get_categories', authenticateToken, async (req, res) => {
    console.log('/get_categories');
    try {
        categoryModel = await categoryModel;
        var data = await categoryModel.find();
        res.status(200).json({ result: data });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;