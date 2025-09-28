import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';
import Post from './Post';
import Tag from './Tag';

class PostTag extends Model {
  public postId!: number;
  public tagId!: number;
}

PostTag.init({
  postId: {
    type: DataTypes.INTEGER,
    references: {
      model: Post,
      key: 'id',
    },
  },
  tagId: {
    type: DataTypes.INTEGER,
    references: {
      model: Tag,
      key: 'id',
    },
  },
}, {
  sequelize,
  tableName: 'post_tags',
  timestamps: false,
});

// Associações N:N
Post.belongsToMany(Tag, { through: PostTag, as: 'tags', foreignKey: 'postId' });
Tag.belongsToMany(Post, { through: PostTag, as: 'posts', foreignKey: 'tagId' });

export default PostTag;