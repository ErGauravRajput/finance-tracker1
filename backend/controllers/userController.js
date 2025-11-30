import { User } from "../models/User.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password"] } 
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.destroy({ where: { id } });
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
};