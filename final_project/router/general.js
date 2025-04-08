const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const axios = require('axios');
const BASE_URL = 'https://vvhoang884-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai';

const { isValid, users } = require('./auth_users.js');

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (isValid(username)) {
        return res.status(409).json({ message: "User already exists" });
    }
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/`);
        res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch books", error: err.message });
    }
});

public_users.get('/isbn/:isbn', async (req, res) => {
    const { isbn } = req.params;
    try {
        const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
        res.status(200).json(response.data);
    } catch (err) {
        res.status(404).json({ message: "Book not found", error: err.message });
    }
});

public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
        res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch books by author", error: err.message });
    }
});

public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
        res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch books by title", error: err.message });
    }
});

public_users.get('/review/:isbn', async (req, res) => {
    const { isbn } = req.params;
    try {
        const response = await axios.get(`${BASE_URL}/review/${isbn}`);
        res.status(200).json(response.data);
    } catch (err) {
        res.status(404).json({ message: "Book not found or review unavailable", error: err.message });
    }
});

module.exports.general = public_users;
