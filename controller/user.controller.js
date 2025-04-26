import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cookie from 'cookie-parser'

import User from '../models/user.model.js'
import { generateToken } from '../utils/generateToken.js'

export async function register (req, res) {
  const { name, email, password } = req.body

  try {
    const findUser = await User.findOne({ email })
    if (findUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new User({
      name,
      email,
      password: hashedPassword
    })

    await user.save()

    const token = generateToken({ email })

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: false,
      sameSite: 'Lax'
    })

    res.status(200).json({
      success: true,
      message: 'User created successfully',
      user
    })
  } catch (err) {
    console.log(err)
    res.status(400).json({ success: false, message: 'Error in creating user' })
  }
}

export async function login (req, res) {
  const { name, email, password } = req.body

  try {
    let userExist = await User.findOne({ email })

    if (!userExist) {
      return res.status(400).json({
        success: false,
        message: 'User does not exist, Please register first'
      })
    }
    let isMatch = await bcrypt.compare(password, userExist.password)

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: 'Incorrect Password' })
    }
    const token = generateToken({ email })
    console.log('Login')

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: true
    })
    // i wanted to save the token in server side also whent the user want to access any routes so we can use the token to verify the user

    res.status(200).json({
      success: true,
      message: 'User logged in successfully'
    })
  } catch (err) {
    console.log(err)
    res
      .status(400)
      .json({ success: false, message: 'Error in logging in user' })
  }
}

export async function logout (req, res) {
  try {
    res.clearCookie('token')
    res
      .status(200)
      .json({ success: true, message: 'User logged out successfully' })
  } catch (err) {
    console.log(err)
    res
      .status(400)
      .json({ success: false, message: 'Error in logging out user' })
  }
}

export async function profile (req, res) {
  try {
    const user = req.user
    res.status(200).json({ success: true, user })
  } catch (err) {
    console.log(err)
    res
      .status(400)
      .json({ success: false, message: 'Error in getting user profile' })
  }
}
