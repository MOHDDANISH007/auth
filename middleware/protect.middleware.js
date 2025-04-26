import jwt from 'jsonwebtoken'


export async function protectMiddleware (req, res, next) {
  const token = req.cookies.token
  

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'No token provided' })
  }

  // Ensure the token is a string
  if (typeof token !== 'string') {
    console.error('Invalid token format:', token)
    return res
      .status(400)
      .json({ success: false, message: 'Invalid token format' })
  }

  try {
    console.log('Token from cookies: ', token) // Log the token to verify

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // Attach decoded user info to the request object
    next()
  } catch (error) {
    console.error('JWT Error:', error)
    return res
      .status(403)
      .json({ success: false, message: 'Invalid or expired token' })
  }
}
