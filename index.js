require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId, ObjectID } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const cors = require("cors");

app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q66zrl2.mongodb.net/?retryWrites=true&w=majority`;
const uri = process.env.DATABASE_LOCAL_1;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});


const run = async () => {
    try {
        const db = client.db("bbc");
        const newsCollection = db.collection("news");

        app.get("/news", async (req, res) => {
            const cursor = newsCollection.find({});
            const news = await cursor.toArray();
            res.send({ status: true, data: news });
        });

        app.post("/news", async (req, res) => {
            const news = req.body;
            const result = await newsCollection.insertOne(news);
            res.send(result);
        });

        app.get("/news/:id", async (req, res) => {
            const _id = req.params.id;
            const result = await newsCollection.findOne({ _id: _id });
            res.send(result);
        });

        app.delete("/news/:id", async (req, res) => {
            const id = req.params.id;
            const result = await newsCollection.deleteOne({ _id: ObjectId(id) });
            res.send(result);
        });

        app.put("/news/:id", async (req, res) => {
            const news = req.body;
            const id = req.params.id;
            console.log(news, id);
            const result = await newsCollection.updateOne({ _id: ObjectID(id) }, { $set: news });
            res.send(result);
        });

    } finally {
    }
};

run().catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
