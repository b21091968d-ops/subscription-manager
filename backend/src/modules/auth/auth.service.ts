import bcrypt from "bcryptjs";
import prisma from "../../config/prisma";
import { generateToken } from "../../utils/jwt";

export async function registerUser(
  email: string,
  password: string,
  name?: string
) {
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name
    }
  });

  const token = generateToken(user.id);

  return { user, token };
}

export async function loginUser(
  email: string,
  password: string
) {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const validPassword = await bcrypt.compare(
    password,
    user.password
  );

  if (!validPassword) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user.id);

  return { user, token };
}
