import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const generateToken = async data => {
  try {
    let token = await jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: '1d'
    })
    console.log('I am from Generating Token Function: ', token)
    return token
  } catch (err) {
    console.log('Error in generating token', err)
    res
      .status(400)
      .json({ success: false, message: 'Error in generating token' })
  }
}
