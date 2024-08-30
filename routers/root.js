const express = require('express');
const Todorouter = require('./todo.router')
const router = express.Router();

router.use("/todos", Todorouter);

module.exports = router;