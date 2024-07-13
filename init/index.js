const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js")


const mongo = "mongodb://127.0.0.1:27017/Myproject";

main().then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(mongo);
}
const initDB = async () =>{     //ye ek function banaya hai
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj) => ({...obj,owner:"668cc61c94f0fd64319b7693"})); //all listings have a own id
    await Listing.insertMany(initData.data);// initdata madhe hyani key data from data.js madhun jo yetoy to ghetla ahe
    console.log("data init");
}
initDB(); // function ko call kiya