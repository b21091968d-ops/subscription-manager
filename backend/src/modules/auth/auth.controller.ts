import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";

export async function register(req: Request, res: Response) {
  const { email, password, name } = req.body;

  const { user, token } = await registerUser(email, password, name);

  res.status(201).json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const { user, token } = await loginUser(email, password);

  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
}
