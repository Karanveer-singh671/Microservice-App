const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const port = 4003;

// event bus emits event to all services at /events.
// moderation service needs to see when comment created if condition then send to event bus with data
app.post("/events", async (req, res) => {
	const { type, data } = req.body;

	if (type === "CommentCreated") {
		const status = data.content.includes("orange") ? "rejected" : "approved";
		// send to event bus which will send to all services and comment service will update required info
		await axios.post("http://localhost:4005/events", {
			type: "CommentModerated",
			data: {
				id: data.id,
				postId: data.postId,
				status,
				content: data.content,
			},
		});
	}
	// prevent request handler from hanging
	res.send({});
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
