const router = require('./auth_route');
var itemsModel = require('../models/usersDB/items');
const { v4: uuidv4 } = require('uuid');
const { authenticateToken } = require('../helpers/auth_helpers/jwt_helper');

//both add and update based on the existence of the uid.
router.post('/add_item', authenticateToken, async (req, res) => {
    console.log('/add_item');
    try {
        itemsModel = await itemsModel;

        var { uid, name, description, owner_id, current_status, bidding_history, image, price, added_date, start_date, deadline } = req.body;
        if (uid) {
            const updatedItem = await itemsModel.findOneAndUpdate({ "uid": uid }, { uid, name, description, owner_id, current_status, bidding_history, image, price, added_date, start_date, deadline });
            res.status(200).json({ result: updatedItem });
        } else {
            uid = uuidv4();
            const newItem = new itemsModel({ uid, name, description, owner_id, current_status, bidding_history, image, price, added_date, start_date, deadline });
            const savedItem = await newItem.save();
            res.status(200).json({ result: savedItem });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});

//only disables the item (setting the status as 'disabled'), doesnt delete permanently.
router.post('/disable_item', authenticateToken, async (req, res) => {
    console.log('/disable_item');
    try {
        itemsModel = await itemsModel;

        const { uid } = req.body;
        if (uid) {
            await itemsModel.findOneAndUpdate({ "uid": uid }, { current_status: "disabled" });
            res.status(200).json({ result: true });
        } else {
            res.status(400).json({ message: 'Invalid UID received' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});

//get active/non-disabled items along wih all other possible conditions.
router.get('/get_items', authenticateToken, async (req, res) => {
    console.log('/get_items');
    try {
        itemsModel = await itemsModel;
        var final_condition = {};
        final_condition.current_status = { $ne: "Disabled" };

        var status = req.body.status ?? "";
        var price_from = req.body.price_from ?? "";
        var price_to = req.body.price_to ?? "";
        var category = req.body.category ?? "";
        var items = [];
        if (status != "") {
            final_condition.current_status = status;
        }
        if (category != "") {
            final_condition.category = category;
        }
        if (price_from != "" && price_to != "") {
            final_condition.price = {
                $gte: parseFloat(price_from),
                $lte: parseFloat(price_to)
            };
        }
        items = await itemsModel.find(final_condition);
        res.status(200).json({ result: items });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});

//get items a specific customer has ever interacted with (bid).
router.get('/get_customer_items', authenticateToken, async (req, res) => {
    console.log('/get_customer_items');
    try {
        itemsModel = await itemsModel;
        var final_condition = {};
        final_condition.current_status = { $ne: "Disabled" };

        var status = req.body.status ?? "";
        var price_from = req.body.price_from ?? "";
        var price_to = req.body.price_to ?? "";
        var category = req.body.category ?? "";
        var user_id = req.body.user_id ?? "";
        var items = [];
        if (status != "") {
            final_condition.current_status = status;
        }
        if (category != "") {
            final_condition.category = category;
        }
        if (user_id != "") {
            final_condition['bidding_history.user_id'] = user_id;
        }
        if (from != "" && to != "") {
            final_condition.price = {
                $gte: parseFloat(price_from),
                $lte: parseFloat(price_to)
            };
        }
        items = await itemsModel.find(final_condition);
        res.status(200).json({ result: items });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});

//get disabled items (optional)
router.get('/get_del_item', authenticateToken, async (req, res) => {
    console.log('/get_del_item');
    try {
        itemsModel = await itemsModel;

        const items = await itemsModel.find({ current_status: "Disabled" });

        res.status(200).json({ result: items });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});

//get items currently on auction.
router.get('/get_auctioning_items', authenticateToken, async (req, res) => {
    console.log('/get_auctioning_items');
    try {
        itemsModel = await itemsModel;
        var final_condition = { current_status: "onsale" }

        var category = req.body.category ?? ""
        if (category != "") {
            final_condition.category = category;
        }
        
        const items = await itemsModel.find(final_condition);

        res.status(200).json({ result: items });
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: error.message });
    }
});




module.exports = router;