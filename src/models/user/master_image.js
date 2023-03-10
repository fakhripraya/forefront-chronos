const {
    DataTypes,
} = require('sequelize');
const { db } = require('../../config/sequelize');
const MasterUser = require('./master_user')

const MasterImage = db.define("MasterImage", {
    id: {
        primaryKey: true,
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
    },
    name: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    linkURI: {
        allowNull: false,
        type: DataTypes.STRING,
    }
},
    {
        paranoid: true,
        deletedAt: 'destroyTime',
        tableName: 'master_image'
    });

MasterImage.belongsTo(MasterUser, {
    foreignKey: 'userId'
});

module.exports = { MasterImage }