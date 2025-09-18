import { Response } from 'express';
import { Comment, Post, User } from '../models';
import { AuthenticatedRequest, CreateCommentRequest } from '../types';

export const getComments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { postId } = req.params;
    const { page = '1', limit = '20' } = req.query;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const offset = (pageNumber - 1) * limitNumber;

    // Check if post exists
    const post = await Post.findByPk(parseInt(postId));
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const comments = await Comment.findAndCountAll({
      where: { 
        postId: parseInt(postId),
        parentId: null, // Only get top-level comments
      },
      limit: limitNumber,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar'],
        },
        {
          model: Comment,
          as: 'replies',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'username', 'avatar'],
            },
          ],
          order: [['createdAt', 'ASC']],
        },
      ],
    });

    res.status(200).json({
      comments: comments.rows,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(comments.count / limitNumber),
        totalItems: comments.count,
        hasNextPage: pageNumber < Math.ceil(comments.count / limitNumber),
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { content, postId, parentId }: CreateCommentRequest = req.body;

    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Check if parent comment exists (if provided)
    if (parentId) {
      const parentComment = await Comment.findByPk(parentId);
      if (!parentComment || parentComment.postId !== postId) {
        res.status(404).json({ error: 'Parent comment not found' });
        return;
      }
    }

    const comment = await Comment.create({
      content,
      postId,
      parentId,
      authorId: req.user.id,
    });

    const createdComment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar'],
        },
      ],
    });

    res.status(201).json({
      message: 'Comment created successfully',
      comment: createdComment,
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { id } = req.params;
    const { content } = req.body;

    const comment = await Comment.findByPk(parseInt(id));
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    // Check if user is the author
    if (comment.authorId !== req.user.id) {
      res.status(403).json({ error: 'Not authorized to update this comment' });
      return;
    }

    await comment.update({ content });

    const updatedComment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar'],
        },
      ],
    });

    res.status(200).json({
      message: 'Comment updated successfully',
      comment: updatedComment,
    });
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteComment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { id } = req.params;

    const comment = await Comment.findByPk(parseInt(id));
    if (!comment) {
      res.status(404).json({ error: 'Comment not found' });
      return;
    }

    // Check if user is the author
    if (comment.authorId !== req.user.id) {
      res.status(403).json({ error: 'Not authorized to delete this comment' });
      return;
    }

    await comment.destroy();

    res.status(200).json({
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};