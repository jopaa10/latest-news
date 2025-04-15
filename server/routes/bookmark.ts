import express from "express";
import authenticateJWT from "../middleware/authMiddleware";
import { prisma } from "../lib/prisma";
import { JwtPayload } from "jsonwebtoken";

const router = express.Router();

// Get all bookmarks for current user
router.get(
  "/get-bookmarks",
  authenticateJWT,
  async (req, res): Promise<any> => {
    const userPayload = req.user as JwtPayload;
    const userId = userPayload?.id;
    try {
      const bookmarks = await prisma.bookmark.findMany({
        where: { userId: userId },
      });
      res.json(bookmarks);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch bookmarks" });
    }
  }
);

// Add a new bookmark
router.post(
  "/add-bookmark",
  authenticateJWT,
  async (req, res): Promise<any> => {
    const { article } = req.body;

    const userPayload = req.user as JwtPayload;
    const userId = userPayload?.id;

    try {
      const existing = await prisma.bookmark.findFirst({
        where: { userId: userId, articleId: article.url },
      });

      if (existing) {
        return res.status(409).json({ message: "Already bookmarked" });
      }

      const bookmark = await prisma.bookmark.create({
        data: {
          userId: userId,
          articleId: article.uri,
          title: article.title,
          author: article.byline?.replace(/^By\s+/i, "") || null,
          image:
            article.multimedia?.[2]?.url ||
            article.multimedia?.[0]?.url ||
            null,
          section: article.section || null,
        },
      });

      res.status(201).json(bookmark);
    } catch (err) {
      res.status(500).json({ error: "Failed to add bookmark" });
    }
  }
);

// Delete a bookmark
router.delete("/remove", authenticateJWT, async (req, res): Promise<any> => {
  const { articleId } = req.query;
  const userPayload = req.user as JwtPayload;
  const userId = userPayload?.id;

  if (!articleId || typeof articleId !== "string") {
    return res.status(400).json({ error: "Missing articleId" });
  }

  try {
    const deleted = await prisma.bookmark.deleteMany({
      where: { userId: userId, articleId },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ error: "Bookmark not found" });
    }

    res.status(200).json({ message: "Bookmark removed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to remove bookmark" });
  }
});

export default router;
