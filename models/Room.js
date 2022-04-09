const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name:{
        type:String
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'posts' 
    },
    imgUrl: {
        type:String,
        required:true
    },
    removeImgUrl: {
        type:String
    },
    hotspots: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'hotspots' 
    }]

});

module.exports = mongoose.model("Room", roomSchema);
