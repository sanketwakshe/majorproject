const express = require("express");
const router = express.Router({mergeParams:true});//app.js madhun apyala purn parent and child id yanaysathi merge
const Review = require("../models/review.js");//reveiw la bolavla
const ExpressError= require("../utils/ExpressError.js");
const wrapAsync = require("../utils/wrapAsync.js"); 
const Listing = require("../models/listing.js");
//const{validateReview} = require("../middleware.js")
// reviews post route

router.post("/", async (req,res) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Added !");
   
    res.redirect(`/listings/${listing._id}`);
});
//review delete route

router.delete("/:reviewId",
    wrapAsync(async(req,res)=>{
        let{id,reviewId} = req.params;
        await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});//pull he ekanda specific id shodhnyasathi
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review Delete !");
       res.redirect(`/listings/${id}`);
    })
);
module.exports = router;