const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

//* foreign keys not added to models (or defined like MySQL), defined as relationships in index.js connecting models
class Comment extends Model { }

Comment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        blog_id: { //* references blog id primary key
            type: DataTypes.INTEGER,
            references: {
                model: 'blog',
                key: 'id',
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id',
            }
        }
        // user_id: { //* references blog id primary key
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: 'user',
        //         key: 'id',
        //     }
        // }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'comment',//* naming model in sequelize
    }
);

module.exports = Comment;
