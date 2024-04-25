const adminmodel = require("../model/admin.model");
const bcryptjs = require("bcrypt");
const storage = require('node-persist');
storage.init();

exports.register = async (req, res) => {
    const email = "admin@gmail.com";
    const password = "admin";
    const hashPassword = await bcryptjs.hash(password, 10);
    try {
        const newUser = new adminmodel({ email: email, password: hashPassword });
        await newUser.save();

        const adminid = newUser._id
        const storeadminid = await storage.setItem('admin', adminid)
        console.log(storeadminid)
        
        res.status(201).json({
            data: newUser,
            message: "User created successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                msg: "All Fields are required.!!",
            });
        }
        const userExists = await adminmodel.findOne({ email });
        if (!userExists) {
            return res.status(404).json({
                success: false,
                msg: "User not Found..!!",
            });
        }

        const checkPassword = await bcryptjs.compare(password, userExists.password);
        if (!checkPassword) {
            return res.status(400).json({
                success: false,
                msg: "Invalid Password..!!",
            });
        }
        const { password: pass, ...rest } = userExists._doc;
        res
            .status(200)
            .json({ success: true, msg: "Sign-In Successfully..!!", user: rest });
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            msg: "Error to Sign-In..!!",
        });
    }
};