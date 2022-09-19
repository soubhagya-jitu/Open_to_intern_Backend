const express = require("express")
const bodyparser = require("body-parser")
const app = express()
const route = require("./routes/route.js")
const mongoose = require("mongoose")

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))
mongoose.connect("mongodb+srv://Hariom:CN2CFpJNl2lt1Sqy@cluster0.ngsk6.mongodb.net/group17Database", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


app.use("/",route)

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});

