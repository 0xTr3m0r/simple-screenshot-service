module.exports= (Sequelize, DataTypes) => {
    const Screenshot = Sequelize.define('Screenshot', {
        id: {
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            allowNull:false
        },
        filename: {
            type:DataTypes.STRING,
            allowNull:false
        },
        url:{
            type:DataTypes.STRING,
            allowNull:false
        }


    }
    ,{
        tableName:'screenshots',
        timestamps:true,
        underscored:true,
        createdAt:'created_at',
        updatedAt:'updated_at'
    }
    )
    return Screenshot;

}