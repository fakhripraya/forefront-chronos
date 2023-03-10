const {
    DataTypes,
    UUIDV4
} = require('sequelize');
const { db } = require('../../config');
const { USER } = require('../../variables/general');
const { MasterImage } = require('./master_image');

const master_User = db.define("master_User", {
    id: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: DataTypes.UUID,
        defaultValue: UUIDV4
    },
    googleId: {
        allowNull: true,
        type: DataTypes.STRING,
    },
    facebookId: {
        allowNull: true,
        type: DataTypes.STRING,
    },
    username: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
    },
    fullName: {
        allowNull: true,
        type: DataTypes.STRING,
    },
    phoneNumber: {
        allowNull: true,
        type: DataTypes.STRING,
    },
    dateOfBirth: {
        allowNull: true,
        type: DataTypes.DATE,
    },
    profilePictureURI: {
        allowNull: true,
        type: DataTypes.STRING,
    },
    KTPNumber: {
        allowNull: true,
        type: DataTypes.STRING,
    },
    email: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    roles: {
        allowNull: false,
        type: DataTypes.JSON,
        defaultValue: `[${USER}]`
    },
    hashedPassword: {
        allowNull: false,
        type: DataTypes.BLOB,
    },
    salt: {
        allowNull: false,
        type: DataTypes.BLOB,
    },
}, {
    paranoid: true,
    deletedAt: 'destroyTime',
    tableName: 'master_user'
});

MasterUser.hasOne(MasterImage, {
    foreignKey: 'userId'
});

module.exports = { MasterUser }
