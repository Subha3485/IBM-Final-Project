const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const SOURCE_URI = process.env.MONGO_URI_LOCAL || "mongodb://127.0.0.1:27017/cookly";
const TARGET_URI = process.env.MONGO_URI_ATLAS || process.env.TARGET_MONGO_URI;
const COLLECTIONS = ["recipes", "users"];

async function connect(uri) {
  const conn = mongoose.createConnection(uri, {
    serverSelectionTimeoutMS: 10000,
  });
  await conn.asPromise();
  return conn;
}

async function migrateCollection(sourceDb, targetDb, name) {
  const sourceCollection = sourceDb.collection(name);
  const targetCollection = targetDb.collection(name);

  const docs = await sourceCollection.find({}).toArray();
  await targetCollection.deleteMany({});
  if (docs.length > 0) {
    await targetCollection.insertMany(docs, { ordered: false });
  }

  const sourceCount = await sourceCollection.countDocuments();
  const targetCount = await targetCollection.countDocuments();
  return { name, sourceCount, targetCount };
}

async function run() {
  if (!TARGET_URI) {
    throw new Error(
      "Missing Atlas URI. Set MONGO_URI_ATLAS (or TARGET_MONGO_URI) in .env before running."
    );
  }
  if (SOURCE_URI === TARGET_URI) {
    throw new Error("Source and target URIs are the same. Aborting migration.");
  }

  let sourceConn;
  let targetConn;
  try {
    sourceConn = await connect(SOURCE_URI);
    targetConn = await connect(TARGET_URI);

    console.log("Connected to local and Atlas MongoDB.");
    for (const collectionName of COLLECTIONS) {
      const result = await migrateCollection(sourceConn.db, targetConn.db, collectionName);
      console.log(
        `${result.name}: local=${result.sourceCount}, atlas=${result.targetCount}`
      );
    }
    console.log("Migration completed.");
  } finally {
    if (sourceConn) await sourceConn.close();
    if (targetConn) await targetConn.close();
  }
}

run().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
