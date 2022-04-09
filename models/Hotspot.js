const mongoose = require('mongoose');

const hotspotSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true
    },
    latitude: {
        type:Number,
        required:true
    },
    longitude: {
        type:Number,
        required:true
    },
    type: {
        type:Number,
        required:true
    },
    currentRoom:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'rooms' 
    },
    nextRoom:{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'rooms' 
    }
});

module.exports = mongoose.model("Hotspot", hotspotSchema);

