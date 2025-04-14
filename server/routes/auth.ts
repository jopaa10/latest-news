import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import dotenv from "dotenv";
import authenticateJWT from "../middleware/authMiddleware";
import nodemailer from "nodemailer";
import crypto from "crypto";

dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Register route
router.post("/register", async (req: Request, res: Response): Promise<any> => {
  const { name, surname, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        surname,
        email,
        password: hashedPassword,
        verified: false,
      },
    });

    const token = jwt.sign(
      { id: newUser.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    const verificationToken = crypto.randomBytes(20).toString("hex");

    await prisma.verificationToken.create({
      data: {
        token: verificationToken,
        userId: newUser.id,
        expiresAt: new Date(Date.now() + 3600000),
      },
    });

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: `no-reply MyNews ${process.env.SMTP_USER}`,
      to: email,
      subject: "Email Verification",
      html: `
        <h2>Welcome to MyNews!</h2>
        <p>Click the link below to verify your email address:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
      `,
    };

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log("Error sending email: ", error);
      }
      console.log("Email sent: ", info.response);
    });

    return res.status(201).json({
      message: "User registered. Please check your email for verification.",
      token,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Login route
router.post("/login", async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    if (!user.verified) {
      return res.status(401).json({ error: "Email not verified" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.get(
  "/current-user",
  authenticateJWT,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const userPayload = req.user as JwtPayload;
      const userId = userPayload?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json(user);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: "Something went wrong" });
    }
  }
);

// Verify email route
router.get(
  "/verify-email",
  async (req: Request, res: Response): Promise<any> => {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }

    try {
      // Find the verification token in the database
      const verificationRecord = await prisma.verificationToken.findUnique({
        where: { token: token as string },
        include: { user: true },
      });

      if (!verificationRecord) {
        return res.status(400).json({ error: "Invalid or expired token" });
      }

      if (verificationRecord.user.verified && verificationRecord.verified) {
        return res.status(200).json({ message: "Email already verified!" });
      }

      // Token expired
      if (new Date() > verificationRecord.expiresAt) {
        return res.status(400).json({ error: "Token has expired" });
      }

      // if (!verificationRecord) {
      //   const user = await prisma.user.findFirst({
      //     where: {
      //       verified: true,
      //     },
      //     include: {
      //       verificationTokens: true,
      //     },
      //   });
      //   if (user?.verified) {
      //     return res.status(200).json({ message: "Email already verified!" });
      //   }

      //   return res.status(400).json({ error: "Invalid or expired token" });
      // }

      // Check if the token has expired
      if (new Date() > verificationRecord.expiresAt) {
        return res.status(400).json({ error: "Token has expired" });
      }

      if (!verificationRecord.user.verified) {
        await prisma.user.update({
          where: { id: verificationRecord.userId },
          data: { verified: true },
        });

        await prisma.verificationToken.update({
          where: { token: token as string },
          data: { verified: true },
        });

        return res
          .status(200)
          .json({ message: "Email successfully verified!" });
      }

      // Fallback: user is verified but token was not marked
      return res.status(200).json({ message: "Email already verified!" });

      // Mark the user as verified
      // await prisma.user.update({
      //   where: { id: user.id },
      //   data: { verified: true },
      // });

      // Delete the verification token (optional, you can keep it in case you want to track used tokens)
      // await prisma.verificationToken.delete({
      //   where: { token: token as string },
      // });

      // await prisma.verificationToken.update({
      //   where: { token: token as string },
      //   data: { verified: true },
      // });

      // return res.status(200).json({ message: "Email verified successfully!" });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
);

router.post(
  "/resend-verification",
  async (req: Request, res: Response): Promise<any> => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.verified) {
        return res.status(400).json({ error: "Email is already verified" });
      }

      // Optional: Delete old verification tokens
      await prisma.verificationToken.deleteMany({
        where: { userId: user.id },
      });

      // Create new secure token
      const verificationToken = crypto.randomBytes(32).toString("hex");

      await prisma.verificationToken.create({
        data: {
          token: verificationToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      });

      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

      const mailOptions = {
        from: `no-reply MyNews <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Email Verification",
        html: `
        <h2>Welcome back to MyNews!</h2>
        <p>Click the link below to verify your email address:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>This link will expire in 1 hour.</p>
      `,
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({
        message: "Verification email sent again. Please check your inbox.",
      });
    } catch (error) {
      console.error("Error resending verification email:", error);
      return res
        .status(500)
        .json({ error: "Failed to resend verification email" });
    }
  }
);

export default router;
