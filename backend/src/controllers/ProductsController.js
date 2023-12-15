import prisma from "../config/PrismaClient.js";
import fs from "fs";

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.products.findMany({
      where: { user_id: req.user.userId },
      select: {
        productId: true,
        name: true,
        price: true,
        categories: true,
        desc: true,
        image: true,
      },
    });
    // Checking Product Existence
    if (!products) {
      return res.status(404).send({ message: "Produk Tidak Ditemukan" });
    }
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const products = await prisma.products.findUnique({
      where: { user_id: req.user.userId, productId: req.params.id },
      select: {
        productId: true,
        name: true,
        price: true,
        categories: true,
        desc: true,
        image: true,
      },
    });
    res.status(200).json({ products });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  const { name, price, categories, desc } = req.body;
  const image = req.file.filename;
  try {
    // Checking Field
    if (!name || !price || !categories || !desc || !image) {
      return res.status(400).send({ message: "Mohon Isi Semua Field" });
    }
    // Creating Data
    const products = await prisma.products.create({
      data: {
        user_id: req.user.userId,
        name,
        price: Number(price),
        categories,
        desc,
        image: image,
      },
    });
    res.status(201).json({
      status: "success",
      message: "Produk Berhasil Ditambahkan!",
      products,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { name, price, categories, desc } = req.body;
  const productId = req.params.id;
  let newImage = null;
  try {
    // Updating Image Data
    if (req.file) {
      newImage = req.file.filename;
      try {
        const path = `../frontend/src/uploads/${req.body.oldImage}`;
        fs.unlinkSync(path);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      newImage = req.body.oldImage;
    }
    // Updating Data
    const products = await prisma.products.update({
      where: {
        user_id: req.user.userId,
        productId: productId,
      },
      data: {
        name,
        price: Number(price),
        categories,
        desc,
        image: newImage,
      },
    });
    res.status(200).json({
      status: "success",
      message: `Produk ${productId} Berhasil Diubah!`,
      products,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  // Checking Image Existence
  const isExist = await prisma.products.findFirst({
    where: { productId: req.params.id },
  });
  if (!isExist) {
    return res.status(404).json({ message: "Produk Tidak Ditemukan" });
  }
  // Deleting Data
  try {
    const path = `../frontend/src/uploads/${isExist.image}`;
    fs.unlinkSync(path);
    await prisma.products.delete({
      where: {
        user_id: req.user.userId,
        productId: productId,
      },
    });
    res
      .status(200)
      .json({ message: `Produk ${productId} Berhasil Dihapus`, success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
