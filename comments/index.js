const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
	res.send(commentsByPostId[req.params.id] || []);
});
// create a comment associated with a post 
app.post("/posts/:id/comments", async (req, res) => {
	const commentId = randomBytes(4).toString("hex");
	const { content } = req.body;

	const comments = commentsByPostId[req.params.id] || [];

	comments.push({ id: commentId, content, status: "pending" });

	commentsByPostId[req.params.id] = comments;
  // emit event to event bus with the information of comment and the type being created
	await axios.post("http://localhost:4005/events", {
		type: "CommentCreated",
		data: {
			id: commentId,
			content,
			postId: req.params.id,
			status: "pending",
		},
	});

	res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
	console.log("Received Event", req.body.type);

	const { type, data } = req.body;
	// event bus will send this event from the moderation service
	if (type === "CommentModerated") {
		const { postId, id, status } = data;

		const comments = commentsByPostId[postId];

		const comment = comments.find((comment) => {
			return comment.id === id;
		});
		comment.status = status;

		// emit event to event bus saying commentUpdated and event bus will send to query service.
		await axios.post("http://localhost:4005", {
			type: "CommentUpdated",
			data: {
				id,
				status,
				postId,
				content,
			},
		});
	}

	res.send({});
});

app.listen(4001, () => {
	console.log("Listening on 4001");
});
