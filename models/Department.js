const { DataTypes} = required('requelize');
module.exports= (sequelize) =>{
    const Department= sequelize.define('Department', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            vaildate: {
                notEmpty: true
            }
        }
    }, {
        tableName: 'departments',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
    return Deaprtment;
};
