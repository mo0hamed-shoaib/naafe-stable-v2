import mongoose from 'mongoose';
import User from "./User.js";
const { Schema } = mongoose;

const adminSchema = new Schema({
    isSuperAdmin: {
        type: Boolean,
        default: false
    },
    permissions: [String]
});

const Admin = User.discriminator('admin', adminSchema);
export default Admin;
