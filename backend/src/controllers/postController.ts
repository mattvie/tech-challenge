import { Response } from 'express';
import { Op } from 'sequelize';
import { Post, User, Comment, Like } from '../models';
import { AuthenticatedRequest, CreatePostRequest, UpdatePostRequest, PostQuery } from '../types';

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
      whereClause.tags = {
        [Op.overlap]: tagArray,
      };
    }

    if (authorId) {
      whereClause.authorId = parseInt(authorId);
    }

    // Intentional N+1 query problem: This will cause performance issues
    const posts = await Post.findAndCountAll({
      where: whereClause,
      limit: limitNumber,
      offset,
      order: [[sortBy, sortOrder]],
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'avatar'],
        },
        // Missing eager loading for comments and likes - will cause N+1 queries
      ],
    });

    // Intentionally inefficient: Making separate queries for each post
    const postsWithCounts = await Promise.all(
      posts.rows.map(async (post) => {
        const commentCount = await Comment.count({ where: { postId: post.id } });
        const likeCount = await Like.count({ where: { postId: post.id } });
        const isLiked = req.user 
          ? await Like.findOne({ where: { postId: post.id, userId: req.user.id } }) !== null
          : false;

        return {
          ...post.toJSON(),
          commentCount,
          likeCount,
          isLiked,
        };
      })
    );

    res.status(200).json({
      posts: postsWithCounts,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(posts.count / limitNumber),
        totalItems: posts.count,
        hasNextPage: pageNumber < Math.ceil(posts.count / limitNumber),
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPostById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const post = await Post.findByPk(parseInt(id), {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'username', 'firstName', 'lastName', 'avatar'],
        },
      ],
    });

    if (!post || !post.isPublished) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }

    // Increment view count
    post.viewCount += 1;
    await post.save();

    // Intentional N+1 query problem: Get comments with authors inefficiently
    const commentsWithAuthors = await post.getCommentsWithAuthors();
    
    const likeCount = await Like.count({ where: { postId: post.id } });
    const isLiked = req.user 
      ? await Like.findOne({ where: { postId: post.id, userId: req.user.id } }) !== null
      : false;

    res.status(200).json({
      post: {
        ...post.toJSON(),
        comments: commentsWithAuthors,
        likeCount,
        isLiked,
      },
    });
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