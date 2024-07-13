const mongoose = require("mongoose");   //mongoose
const Schema = mongoose.Schema;
const Review = require("./review.js")

const listingSchema = new Schema({
    title: {
        type: String,
        require: true,
    },
    description: String,
    image: {
        filename: { type: String },
        url: { type: String },
    },
    price: {
        type: Number,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }],
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User",
        },
        category:{
            type:String,
            enum:["mountains","farms","rooms","amazing pools","beach"]
        }
});
listingSchema.post("findOneAndDelete",async(listing) =>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
