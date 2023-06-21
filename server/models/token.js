const mongoos = require('mongoose')

const {Schema} = mongoos

const refreshTokenSchema = new Schema({
    token: {type: String, required: true},
    userId: {type: mongoos.SchemaTypes.ObjectId, ref:'User'}
},
{timestamps: true}
)

module.exports = mongoos.model("RefreshToken", refreshTokenSchema, "tokens")