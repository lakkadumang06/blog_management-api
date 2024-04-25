const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    authorid:{
        type: String,
        required: true 
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    like:{
        type: Number,
        default: 0
    },
    cat_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"category"
    },
    comment_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"comment"
    }
});

module.exports = mongoose.model('blog', blogSchema)

