const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const wikiSchema = new mongoose.Schema({
	title: String,
	content: String,
});
const Article = mongoose.model("Article", wikiSchema);

app
	.route("/articles")
	.get(function (req, res) {
		Article.find(function (err, results) {
			if (!err) {
				res.send(results);
			} else {
				res.send(err);
			}
		});
	})
	.post(function (req, res) {
		const newArticle = new Article({
			title: req.body.title,
			content: req.body.content,
		});

		newArticle.save(function (err) {
			if (!err) {
				res.send("Successfully added a new article");
			} else {
				res.send(err);
			}
		});
	})
	.delete(function (req, res) {
		Article.deleteMany(function (err) {
			if (!err) {
				res.send("Successfully deleted all items");
			} else {
				res.send(err);
			}
		});
	});

////////////////////////Specific Articles//////////////////////////

app
	.route("/articles/:articleTitle")

	.get(function (req, res) {
		Article.findOne({ title: req.params.articleTitle }, function (err, result) {
			if (result) {
				res.send(result);
			} else {
				res.send("No articles matching that title was found.");
			}
		});
	})

	.put(function (req, res) {
		Article.replaceOne(
			{ title: req.params.articleTitle },
			{ title: req.body.title, content: req.body.content },
			{ overwrite: true },
			function (err) {
				if (!err) {
					res.send("Successfully updated the article!");
				} else {
					res.send(err.message);
				}
			}
		);
	})

	.patch(function (req, res) {
		Article.updateOne(
			{ title: req.params.articleTitle },
			{ $set: req.body },
			{ overwrite: true },
			function (err) {
				if (!err) {
					res.send("Successfully updated the article.");
				} else {
					res.send(err);
				}
			}
		);
	})

	.delete(function (req, res) {
		Article.deleteOne({ title: req.params.articleTitle }, function (err) {
			if (!err) {
				res.send("Successfully deleted the article.");
			} else {
				res.send(err);
			}
		});
	});

app.listen(3000, function () {
	console.log("Server is up and running on port 3000.");
});
