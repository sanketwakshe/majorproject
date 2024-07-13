const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const{isLoggedIn, isOwner} = require("../middleware.js");
const flash = require("connect-flash");


router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));
 
//new listings
router.get ("/new",isLoggedIn, (req, res) => {
 res.render("listings/new.ejs");
});



// Index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
    res.redirect("/listings");
}));

// Show route
router.get("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({ path:"reviews",
        populate:{
            path:"author",
            model:"user"
        }
    })
    .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
        console.log(listing)
    }
    res.render("listings/show.ejs", { listing });
}));

// Create route
router.post("/",isLoggedIn, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; //if have a owner id  to the user.js
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
}));

// Edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requester for does not exits");
        res.redirect("/listings")
    }
    res.render("listings/edit.ejs", { listing });
}));

// Update route
router.put("/:id",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing edited!");
    res.redirect(`/listings/${id}`);
}));

// Delete route
router.delete("/:id", isLoggedIn,isOwner,wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
}));

module.exports = router;
