const blogmodel = require("../model/blog.model");
const categorymodel = require("../model/category.model");
const storage = require('node-persist');
storage.init();

exports.addblog = async (req, res) => {
    const userId = await storage.getItem('user_id');
    const { title, content, status } = req.body;
    try {
        const blog = new blogmodel({ authorid: userId, title, content, status });
        await blog.save();
        res.status(201).json({
            message: "Blog created successfully",
            data: blog
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


exports.getblog = async (req, res) => {
    try {
        const blog = await blogmodel.find().populate("cat_id");
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.update = async (req, res) => {
    const { id } = req.params;
    const { title, content, status } = req.body;
    try {
        const blog = await blogmodel.findByIdAndUpdate(id, { title, content, status }, { new: true });
        res.status(200).json({
            message: "Blog updated successfully",
            data: blog
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const blog = await blogmodel.findByIdAndDelete(id);
        res.status(200).json({
            message: "Blog Delete successfully",
            data: blog
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.likeblog = async (req, res) => {
    const id = req.params.id;
    try {
        const blog = await blogmodel.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        console.log("Blog found:", blog);
        blog.like += 1;
        await blog.save();
        res.status(200).json({
            message: "Blog liked successfully",
            data: blog
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

// exports.addcategory = async (req, res) => {
//     const { id } = req.params;
//     console.log(id);
//     const { category } = req.body;
//     try {
//         const newCategory = new categorymodel({ category });
//         await newCategory.save();

//         const blog = await blogmodel.findById(id);

//         if (!blog) {
//             return res.status(404).json({ message: "Blog not found" });
//         }
//         blog.cat_id = newCategory._id;
//         await blog.save();

//         await blog.populate("cat_id");

//         res.status(200).json({
//             message: "Blog updated successfully",
//             data: blog
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// };


exports.addcategory = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const { category } = req.body;
    try {
        // Check if the category already exists
        const existingCategory = await categorymodel.findOne({ category });

        // If the category already exists, return a message indicating it
        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists" });
        }

        // If the category doesn't exist, create and save it
        const newCategory = new categorymodel({ category });
        await newCategory.save();

        const blog = await blogmodel.findById(id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        blog.cat_id = newCategory._id;
        await blog.save();  

        // Populate the category field in the blog document
        await blog.populate("cat_id");

        res.status(200).json({
            message: "Blog updated successfully",
            data: blog
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.addadminblog = async (req, res) => {
    const adminId = await storage.getItem('admin');

    if (!adminId) {
        return res.status(404).json({ message: "Admin not found" });
    }
    console.log(adminId);
    const { title, content, status } = req.body; // Destructure req.body to extract fields
    try {
        const blog = new blogmodel({ authorid: adminId, title, content, status });
        await blog.save();
        res.status(201).json({
            message: "Blog created successfully",
            data: blog
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getadminblog = async (req, res) => {
    const adminId = await storage.getItem('admin');
    if (!adminId) {
        return res.status(404).json({ message: "Admin not found" });
    }
   
    try {
        if ("cat_id" > 0) {
            const blog = await blogmodel.findById(adminId).populate("cat_id");
        }

        const blog = await blogmodel.find({ authorid: adminId });

        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.adminblogupdate = async (req, res) => {
    const adminId = await storage.getItem('admin');
    if (!adminId) {
        return res.status(404).json({ message: "Admin not found" });
    }
    const { id } = req.params;
    const { title, content, status } = req.body;
    try {
        const blog = await blogmodel.findByIdAndUpdate(id, { title, content, status }, { new: true });
        res.status(200).json({
            message: "Blog updated successfully",
            data: blog
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.adminblogdelete = async (req, res) => {
    const adminId = await storage.getItem('admin');
    if (!adminId) {
        return res.status(404).json({ message: "Admin not found" });
    }
    const { id } = req.params;
    try {
        const blog = await blogmodel.findByIdAndDelete(id);
        res.status(200).json({
            message: "Blog deleted successfully",
            data: blog
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getadminuserblog = async (req, res) => {
    const adminId = await storage.getItem('admin');

    try {
        if (!adminId) {
            return res.status(404).json({ message: "Admin not found" });
        } else {
            const userid = req.params.id;
            const blog = await blogmodel.find({ authorid: userid });
            res.status(200).json(blog);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.adminupdatestatusblog = async (req, res) => {
    const adminId = await storage.getItem('admin');
    if (!adminId) {
        return res.status(404).json({ message: "Admin not found" });
    }
    const { id } = req.params;
    const { status } = req.body;
    try {
        const blog = await blogmodel.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json({
            message: "Blog updated successfully",
            data: blog
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getstatusbyblog = async (req, res) => {
    const adminId = await storage.getItem('admin');
    if (!adminId) {
        return res.status(404).json({ message: "Admin not found" });
    }
    const status = req.body.status;

    try {
        if (status == 'draft' || status == 'published') {
            try {
                const blog = await blogmodel.find({ status: status });
                res.status(200).json(blog);
            } catch (error) {
                res.status(500).json({ message: error.message });
            }
        }
        else {
            res.status(500).json({ message: "Status not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getcategorybyblog = async (req, res) => {
    const adminId = await storage.getItem('admin');
    if (!adminId) {
        return res.status(404).json({ message: "Admin not found" });
    }
    const categoryName = req.body.category;

    try {
        const blogs = await blogmodel.find({ 'cat_id.category': categoryName });
        console.log(blogs);
        res.status(200).json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
