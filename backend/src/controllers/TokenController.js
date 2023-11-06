import prisma from "../config/PrismaClient.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    const { token } = req.cookies; // token (alias) => refreshToken
    if (!token) return res.sendStatus(401);
    const user = await prisma.user.findMany({
      where: { refreshToken: token },
    });
    if (!user[0]) return res.sendStatus(403);
    jwt.verify(token, process.env.REFRESH_TOKEN, (err, decoded) => {
      if (err) return res.sendStatus(403);
      const userId = user[0].userId;
      const name = user[0].name;
      const email = user[0].email;
      const accessToken = jwt.sign(
        {
          userId,
          name,
          email,
        },
        process.env.ACCESS_TOKEN,
        { expiresIn: process.env.AT_EXPIRE }
      );
      res.json({ accessToken: accessToken });
    });
  } catch (error) {
    console.log(error);
  }
};
