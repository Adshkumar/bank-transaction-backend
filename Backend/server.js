require("dotenv").config();
const app = require("./app");
const connectDB = require("./db/db");

connectDB();

app.listen(process.env.PORT, () => {
    console.log(`🚀 Server is running on port ${process.env.PORT}`);
});