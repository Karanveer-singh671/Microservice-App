const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
// req tab
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 4002;

const commentsByPostId = {};
app.get("/posts/:id/comments", (req, res) => {
	res.send(commentsByPostId[req.params.id] || []);
});
app.post("/posts/:id/comments", function (req, res) {
	const commentId = randomBytes(4).toString("hex");
	const { content } = req.body;
	const comments = commentsByPostId[req.params.id] || [];
	comments.push({ id: commentId, content });

	commentsByPostId[req.params.id] = comments;

	res.status(201).send(comments);
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
