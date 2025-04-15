const express = require('express');
const Note = require('../models/Note'); // Assuming Note is your Mongoose model

const router = express.Router();

// Fetch all notes
router.get('/list', async (req, res) => {
	try {
		const notes = await Note.find().sort({ dateadded: -1 });
		console.log('한 번 더 수정을 해봤다. 자동으로 변경되는지');
		res.json(notes);
	} catch (error) {
		res.status(500).json({
			status: 'error',
			message: 'Error fetching notes.',
		});
	}
});

// Fetch notes by user ID
router.get('/list/:userid', async (req, res) => {
	try {
		const notes = await Note.find({ userid: req.params.userid }).sort({ dateadded: -1 });
		res.json(notes);
	} catch (error) {
		res.status(500).json({
			status: 'error',
			message: 'Error fetching notes.',
		});
	}
});

// Add a new note
router.post('/add', async (req, res) => {
	const { id, userid, title, content } = req.body;

	if (!id || !userid || !title || !content) {
		return res.status(400).json({
			status: 'error',
			message: 'All fields are required.',
		});
	}

	try {
		const newNote = new Note({
			id,
			userid,
			title,
			content,
		});
		await newNote.save();

		res.status(200).json({
			status: 'success',
			message: 'Note added successfully',
			data: newNote,
		});
	} catch (error) {
		res.status(500).json({
			status: 'error',
			message: 'An error occurred while saving the note.',
		});
	}
});

// Delete a note
router.post('/delete', async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res.status(400).json({
			status: 'error',
			message: 'ID is required.',
		});
	}

	try {
		const deletedNote = await Note.deleteOne({ id });

		if (deletedNote.deletedCount === 0) {
			return res.status(404).json({
				status: 'error',
				message: `Note with ID ${id} not found.`,
			});
		}

		res.status(200).json({
			status: 'success',
			message: 'Note deleted successfully',
			data: deletedNote,
		});
	} catch (error) {
		res.status(500).json({
			status: 'error',
			message: 'An error occurred while deleting the note.',
		});
	}
});

module.exports = router;
