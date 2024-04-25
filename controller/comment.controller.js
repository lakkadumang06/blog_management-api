const commentmodel = require("../model/comment.model");
const blogmodel = require("../model/blog.model");


exports.addcommenttoblog = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const { comment } = req.body;
    try {
        const existingComment = await commentmodel.findOne({ comment });
        console.log(existingComment)
       
        const newComment = new commentmodel({ comment });
        console.log(newComment)
        await newComment.save();

        const blog = await blogmodel.findById(id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        blog.comment_id = newComment._id;
        await blog.save();

        await blog.populate("comment_id");

        res.status(201).json({
            message: "Comment Created And Added Successfully",
            data: blog
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getcomment = async (req, res) => {
    try {
        const comment = await commentmodel.find();
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
