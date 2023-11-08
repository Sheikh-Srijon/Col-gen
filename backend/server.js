const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;
//! run middlewares
require("dotenv").config();
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json()); // Parse JSON requests

//! run mongodb client
const { MongoClient, ServerApiVersion } = require("mongodb");
//Todo: use env variables
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;

const uri = `mongodb+srv://skrdsrijon:${MONGODB_PASSWORD}@essay-database.qhzzhr4.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    //   } finally {
    //     // Ensures that the client will close when you finish/error
    //     await client.close();
  } catch (err) {
    console.log("mongo connection err ", err);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
 
  res.send("<h1>Hello</h1>");
});

app.post("/submit", async (req, res) => {
  try {
    const { essay, feedback } = req.body;
    // Access the essays collection in the database (create it if it doesn't exist)
    const db = client.db("essay_db");
    const essaysCollection = db.collection("essays");
    // Check if an essay with the same content already exists
    const existingEssay = await essaysCollection.findOne({ essay });

    if (existingEssay) {
      // If a duplicate essay is found, return an error response
      return res
        .status(400)
        .send("Essay with the same content already exists.");
    }

    // Create a new essay document and insert it into the collection
    const newEssay = {
      essay,
      feedback,
    };

    const result = await essaysCollection.insertOne(newEssay);

    // Close the MongoDB connection
    // client.close();

    res.status(200).send(result);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal Server Error");
  }
});

// app.post('/submit', (req, res) => {
//     res.send('<h1>');
//     // const { essay, feedback } = req.body;
//     // console.log("req ", req.body)
//     // // Read existing entries from the JSON file (if any)
//     // let entries = [];
//     // try {
//     //     // __dirname + '/index.html');
//     //     const data = fs.readFileSync(__dirname+'/../../public/entries.json', 'utf8');
//     //     entries = JSON.parse(data).inputs;
//     //     console.log("entries check ", entries);
//     // } catch (err) {
//     //     console.error('Error reading entries.json:', err);
//     // }

//     // // Generate a new entry and add it to the entries array
//     // const newEntry = {
//     //     id: entries.length + 1, // You can use a more sophisticated ID generation logic
//     //     essay,
//     //     feedback,
//     // };
//     // entries.push(newEntry);

//     // // Write the updated entries array back to the JSON file
//     // fs.writeFileSync('entries.json', JSON.stringify({ inputs: entries }, null, 2));

//     // res.send('Feedback submitted successfully.');
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
