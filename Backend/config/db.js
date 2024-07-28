const mongoose = require("mongoose");

const uri =
    `mongodb+srv://hritik123:hritik123@cluster0.zjorazh.mongodb.net/${process.env.DB_NAME}`;

mongoose
    .connect(uri)
    .then(() => {
        console.log("------------ DB Connected --------------");
    })
    .catch((err) => {
        console.log("DB Connect Failed:\n");
        console.log(err);
    });
