const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const auth = require('./routes/auth_route');
const itemsRoute = require('./routes/items_route.js');
const categoryRoute = require('./routes/category_route.js');
const CustomError = require('./handle/custom_error');

const fileRoute = require('./routes/file_upload.js');


const app = express();
const httpPort = process.env.HTTP_PORT;

// DBcon();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve static files

app.use(express.static('public'));

// Routes
app.use('/auth', auth);
app.use('/items', itemsRoute);
app.use('/file', fileRoute);
app.use('/category', categoryRoute);
app.route('/').get((req, res) => {
    res.send("Welcome to the API");
});



// Custom error handler
// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof CustomError) {
        res.status(400).json({
            error: {
                code: err.code,
                message: err.message
            }
        });
    } else {
        // Handle other types of errors
        next(err);
    }
});


app.listen(httpPort, () => {
    console.log(`HTTP Server started on port ${httpPort}`);
});
