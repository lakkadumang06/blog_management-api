const usermodel = require('../model/user.model');
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcrypt");
const storage = require('node-persist');
storage.init();

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const emailExists = await usermodel.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = new usermodel({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({
            data: newUser,
            message: "User created successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            msg: "All Fields are required.!!",
        });
    }
    try {
        const userExists = await usermodel.findOne({ email });
        if (!userExists) {
            return res.status(404).json({
                success: false,
                msg: "User not Found..!!",
            });
        }
        const user_id = userExists._id
        const id = await storage.setItem('user_id', user_id);

        const checkPassword = await bcryptjs.compare(password, userExists.password);
        if (!checkPassword) {
            return res.status(400).json({
                success: false,
                msg: "Invalid Password..!!",
            });
        }

        const token = jwt.sign({ id: userExists._id }, "umang");
        const { password: pass, ...rest } = userExists._doc;
        res
            .status(200)
            .cookie("access_token", token, { httpOnly: true })
            .json({ success: true, msg: "Sign-In Successfully..!!", user: rest });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            msg: "Error to Sign-In..!!",
        });
    }
};

exports.update = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await usermodel.findOne({ email });
        if (!userExists) {
            return res.status(404).json({
                success: false,
                msg: "User not Found..!!",
            });
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        const user_id = userExists._id
        const id = await storage.setItem('user_id', user_id);
        const { password: pass, ...rest } = userExists._doc;

        const newUser = new usermodel({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({
            data: newUser,
            message: "User updated successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.delete = async (req, res) => {
    const user_id = req.params.id
    try {
        const user = await usermodel.findByIdAndDelete(user_id);
        res.status(200).json({
            data: user,
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

    exports.getuser = async (req, res) => {
        try {
            const users = await usermodel.find();
            res.status(200).json({
                data: users,
                message: "Users fetched successfully"
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
