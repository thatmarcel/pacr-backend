const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

app.use(express.json());

const connectToMongoDB = require("./helpers/database/connect");
let db;

connectToMongoDB().then(_db => {
    db = _db;
    startRepeatingTasks(db);
}).catch(err => console.error(err));

app.get("/doc/fetch", async (req, res) => {
    const docId = req.query.id;

    const results = await db.collection("documents").find({
        docId: docId
    }).toArray();

    if (results.length < 1) {
        res.status(404).send("Document not found");
        return;
    }

    res.status(200).send(results[0].content);
});

app.post("/doc/save", async (req, res) => {
    const docId = req.body.id;
    const docContent = req.body.content;

    if (!docId || !docContent) {
        res.status(400).send("Bad Request - missing body parameters for id and/or content");
        return;
    }

    try {
        await db.collection("documents").deleteMany({
            docId: docId
        });
    } catch {}

    await db.collection("documents").insertOne({
        docId: docId,
        content: docContent
    });

    res.status(200).send("Success");
});

app.listen(process.env.PORT || 4000);