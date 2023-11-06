import prisma from "../config/PrismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Register = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  try {
    if (!name || !email || !password || !confPassword)
      return res.status(400).send({ message: "Mohon Isi Semua Field" });
    // Check if password matched
    if (password !== confPassword)
      return res.status(400).json({ message: "Password Tidak Cocok" });
    const salt = await bcrypt.genSalt(10);
    const hashPwd = await bcrypt.hash(password, salt);
    // Create user
    const user = await prisma.user.create({
      data: { name, email, password: hashPwd },
    });
    return res.json({
      message: "Registrasi Berhasil!",
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).send({ message: "Mohon Isi Email dan Password" });
    // Find user email and Checking user existence
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(404).send({ message: "Email Tidak Ditemukan" });
    // Find user password and matched the password
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) return res.status(401).send({ message: "Password Salah" });
    // Set refresh ann access token
    const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
      expiresIn: process.env.AT_EXPIRE,
    });
    const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN, {
      expiresIn: process.env.RT_EXPIRE,
    });
    await prisma.user.update({
      where: { userId: user.userId },
      data: { refreshToken: refreshToken },
    });
    res.cookie("token", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({
      message: "Login Berhasil!",
      success: true,
      accessToken: accessToken,
    });
  } catch (error) {
    return res.json({ message: error.message });
  }
};

export const Logout = async (req, res) => {
  const { token } = req.cookies;
  // Checking refresh token existence
  if (!token) return res.status(204).json({ message: "Token Tidak Ditemukan" });
  const user = await prisma.user.findMany({
    where: { refreshToken: token },
  });
  if (!user[0])
    return res.status(204).json({ message: "Token Tidak Ditemukan" });
  // Delete refresh token
  await prisma.user.update({
    where: { userId: user[0].userId },
    data: { refreshToken: null },
  });
  res.clearCookie("token");
  return res.json({ message: "Logout Berhasil!", success: true });
};

export const Profile = async (req, res) => {
  try {
    const user = await prisma.user.findMany({
      where: { userId: req.user.userId },
      select: {
        userId: true,
        name: true,
        email: true,
      },
    });
    // Check user existence
    if (!user) return res.status(404).send({ message: "User Tidak Ditemukan" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
