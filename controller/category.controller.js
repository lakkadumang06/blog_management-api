const categorymodel = require("../model/category.model");

exports.getcategory = async (req, res) => {
    try {
        const category = await categorymodel.find();
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}