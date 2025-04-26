import {Schema, model} from "mongoose";

const userSchema = new Schema({
    name : {
        type: String,
        required: true
    },
    email :{
        type: String,
        required: true,
        unique: true
    },
    password :{
        type: String,
        required: true
    }
},{timestamps: true})

// create user Model

const User = model('User', userSchema)
export default User;


