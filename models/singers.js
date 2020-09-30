const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const singersSchema = new Schema({


    name: {
        type: String,
        trim:true
    }

}, 
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Singers", singersSchema, 'singers');