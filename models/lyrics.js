const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const lyricsSchema = new Schema({


    Singer: {
        type: String,
        trim:true
    },
    Lyricist: {
        type: String,
        trim: true
    },
    Language: {
        type: String,
        trim: true,
    },
    Lyrics: {
        type: String,
        trim: true,
    },
    Title: {
        type: String,
        trim: true,
    },
    Album: {
        type: String,
        trim: true,
    },
    Music: {
        type: String,
        trim: true,
    },
    Director: {
        type: String,
        trim: true,
    },
    Label: {
        type: String,
        trim: true,
    }

}, 
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Lyrics", lyricsSchema, 'lyrics');