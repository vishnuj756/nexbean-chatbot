
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userSchema from '../modals/userSchema.js';

// REGISTER
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    const existingUser = await userSchema.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userSchema({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Nexbean user created successfully!" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userSchema.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ token, username: user.username, message: "Welcome to Nexbean!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// forgot Password

export const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        status: false,
        message: "Email and new password are required",
      });
    }

    const existingUser = await userSchema.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        status: false,
        message: "User is not registered",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    existingUser.password = hashedPassword;
    await existingUser.save();

    return res.status(200).json({
      status: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error(error?.message);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};


// change password

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, NewPassword } = req.body;
    const userId = req?.user?.id
    const user = await userSchema?.findById(userId)
    if (!user) {
      res.status(404).json({
        status: false,
        message: "user not found"
      })
    }
    else {
      const isMatch = await bcrypt.compare(oldPassword, user?.password)
      if (!isMatch) {
        res.status(400).json({
          status: false,
          message: "old password is incorrect "
        })
      }
      else {
        const hashedPassword = await bcrypt.hash(NewPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
          status: true,
          message: "Password changed successfully",
        });
      }

    }


  }
  catch (error) {
    console.error(error?.message)
    res.status(505).json({
      status: false,
      message: "internal server error "
    })

  }
}

