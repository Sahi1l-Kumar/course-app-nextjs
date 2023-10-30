import mongoose from "mongoose";

const mongoURL = process.env.MONGO_URL;

export default function connectToDB() {
  if (!mongoURL) {
    console.error("MongoDB url is not defined in env ");
    return;
  }
  return mongoose
    .connect(mongoURL, { dbName: "Course-Selling-App" })
    .then(() => {
      console.log("Connected to MongoDB successfully");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB", error);
    });
}
