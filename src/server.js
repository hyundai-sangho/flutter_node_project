if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config({ path: './config/.env' }); // Ensure the path is correct
}

const express = require('express');
const app = express();
const PORT = process.env.PORT || 7000;
const noteRouter = require('./routes/Note'); // Ensure this path is correct

const mongoose = require('mongoose');
const mongoDbPath = process.env.MONGODBURI;
const Note = require('./models/Note');
const cors = require('cors');

app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'] }));

// Validate MongoDB URIs
if (!mongoDbPath || !mongoDbPath.startsWith('mongodb+srv://')) {
	console.error('Error: Invalid or missing MongoDB URI.');
	process.exit(1);
}

// Connect to MongoDB
mongoose
	.connect(mongoDbPath)
	.then(() => {
		console.log('Successfully connected to MongoDB Atlas');

		app.use(express.urlencoded({ extended: false }));
		app.use(express.json());

		// Use the router for routes
		app.use('/notes', noteRouter);

		app.get('/', (req, res) => {
			const response = { message: 'API Works' };
			res.json(response);
		});
	})
	.catch((err) => {
		console.error(`MongoDB connection error: ${err}`);
		process.exit(1); // Exit the process if the database connection fails
	});

// Start the server
app.listen(PORT, () => {
	console.log(`Server running at: http://localhost:${PORT}`);
});
