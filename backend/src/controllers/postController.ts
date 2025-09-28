import { Response } from 'express';
import { Op } from 'sequelize';
import { Post, User, Comment, Like } from '../models';
import { AuthenticatedRequest, CreatePostRequest, UpdatePostRequest, PostQuery } from '../types';
import { sequelize } from '../config/database';

export const getPosts = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '10',
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      search,
      tags,
      authorId,
    }: PostQuery = req.query;
    const userId = req.user?.id;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const offset = (pageNumber - 1) * limitNumber;

    const whereClause: any = {
      isPublished: true,
    };

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      whereClause.tags = { [Op.overlap]: tagArray };
    }
    if (authorId) {
      whereClause.authorId = parseInt(authorId);
    }

    const { count, rows: posts } = await Post.findAndCountAll({
      where: whereClause,
      limit: limitNumber,
      offset,
      order: [[sortBy, sortOrder]],
      attributes: {
        // CORREÇÃO: Adicionamos subqueries para calcular os likes no banco de dados
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM likes AS "like"
              WHERE "like"."postId" = "Post"."id"
            )`),
            'likesCount'
          ],
          [
            sequelize.literal(`(
              SELECT COUNT(*) > 0
              FROM likes AS "userLike"
              WHERE "userLike"."postId" = "Post"."id" AND "userLike"."userId" = ${userId || 'NULL'}
            )`),
            'isLikedByCurrentUser'
          ]
        ]
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar'],
        }
      ],
      distinct: true,
    });

    res.status(200).json({
      posts: posts, // Não precisamos mais do map, os dados já vêm corretos
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(count / limitNumber),
        totalItems: count,
        hasNextPage: pageNumber < Math.ceil(count / limitNumber),
        hasPrevPage: pageNumber > 1,
      },
    });
    
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// backend/src/controllers/postController.ts

export const getPostById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const post = await Post.findByPk(parseInt(id), {
      attributes: {
        // CORREÇÃO: Mesma lógica de subquery da função getPosts
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM likes AS "like"
              WHERE "like"."postId" = "Post"."id"
            )`),
            'likesCount'
          ],
          [
            sequelize.literal(`(
              SELECT COUNT(*) > 0
              FROM likes AS "userLike"
              WHERE "userLike"."postId" = "Post"."id" AND "userLike"."userId" = ${userId || 'NULL'}
            )`),
            'isLikedByCurrentUser'
          ]
        ]
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'firstName', 'lastName', 'avatar'],
        },
        {
          model: Comment,
          as: 'comments',
          include: [{
            model: User,
            as: 'author',
            attributes: ['id', 'username', 'avatar']
          }],
          order: [['createdAt', 'DESC']]
        }
      ],
    });

    if (!post || !post.isPublished) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // A contagem de views permanece igual
    post.viewCount += 1;
    await post.save();
    
    // As chamadas ineficientes para Like.count e Like.findOne foram removidas
    res.status(200).json({ post });

  } catch (error) {
    console.error('Get post by id error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createPost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { title, content, excerpt, imageUrl, tags }: CreatePostRequest = req.body;

    const post = await Post.create({
      title,
      content,
      excerpt,
      imageUrl,
      tags: tags || [],
      authorId: req.user.id,
      isPublished: true,
      publishedAt: new Date(),
    });

    const createdPost = await Post.findByPk(post.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar'],
        },
      ],
    });

    res.status(201).json({
      message: 'Post created successfully',
      post: createdPost,
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { id } = req.params;
    const { title, content, excerpt, imageUrl, tags }: UpdatePostRequest = req.body;

    const post = await Post.findByPk(parseInt(id));
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Check if user is the author
    if (post.authorId !== req.user.id) {
      res.status(403).json({ error: 'Not authorized to update this post' });
      return;
    }

    await post.update({
      title,
      content,
      excerpt,
      imageUrl,
      tags,
    });

    const updatedPost = await Post.findByPk(post.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar'],
        },
      ],
    });

    res.status(200).json({
      message: 'Post updated successfully',
      post: updatedPost,
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deletePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { id } = req.params;

    const post = await Post.findByPk(parseInt(id));
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Check if user is the author
    if (post.authorId !== req.user.id) {
      res.status(403).json({ error: 'Not authorized to delete this post' });
      return;
    }

    await post.destroy();

    res.status(200).json({
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const likePost = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const { id } = req.params;

    const post = await Post.findByPk(parseInt(id));
    if (!post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    const existingLike = await Like.findOne({
      where: { postId: post.id, userId: req.user.id },
    });

    if (existingLike) {
      await existingLike.destroy();
      res.status(200).json({ message: 'Post unliked', liked: false });
    } else {
      await Like.create({ postId: post.id, userId: req.user.id });
      res.status(200).json({ message: 'Post liked', liked: true });
    }
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};