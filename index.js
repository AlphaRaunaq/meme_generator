const axios = require('axios').default;
const express = require('express');
const app = express();
const _ = require('lodash');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'));
app.set('view engine', 'ejs');

app.get("/", (req, res) => {

    axios.get("https://api.imgflip.com/get_memes").then((memes) => {
        res.render("index", { 
            memes: _.sampleSize(memes.data.data.memes, 10)
        }
        );
    }).catch((e) => {
        res.status(500);
        res.send("500 Internal Server Error");
    });
});

app.get("/error", (req, res) => {
    axios.get("http://localhost:3000/").then(() => {
        res.send("Everything is working");
    }).catch((e) => {
        res.send("API is Faulty");
    });
});
app.post("/generate", (req, res) => {
    axios.post("https://api.imgflip.com/caption_image", {}, {
        params: {
            "template_id": req.body.template_id,
            "username": req.body.username,
            "password": req.body.password,
            "text0": req.body.text0,
            "text1": req.body.text1
        }
    }).then((response) => {
        return res.send(`<img src="${response.data.data.url}">`);
    }).catch((e) => {
        return res.status(403).send("403 Client Error");
    });
});

app.listen(3000, () => {
    console.log("Server is listening at 3000");
});