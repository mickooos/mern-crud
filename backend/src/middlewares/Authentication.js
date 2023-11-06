import jwt from "jsonwebtoken";
import prisma from "../config/PrismaClient.js";

export const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return next("Maaf, Login Untuk Akses!");
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });
    next();
  } catch (error) {
    return next(error.message);
  }
};
