const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 4002;

const posts = {};

app.get("/posts", (req, res) => res.send("Hello World!"));
// when a post created it will send to event bus the event and the event bus emits event to all other services
// and query service handles storing what needs for user to query
app.post("/events", function (req, res) {
	const { type, data } = req.body;

	if (type === "PostCreated") {
		const { id, title } = data;

		posts[id] = { id, title, comments: [] };
	}
	if (type === "CommentCreated") {
		const { id, content, postId } = data;
		const post = posts[postId];
		post.comments.push({ id, content });
	}
	if (type === "CommentUpdated") {
		const { id, content, status, postId } = data;
		const post = posts[postId];
		const comment = post.comments.find((comment) => {
			return comment.id === id;
		});
		comment.status = status;
		comment.content = content;
	}
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
