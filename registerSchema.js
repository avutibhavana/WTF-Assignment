const Mongoose = require("mongoose")
const Validator = require("validator")

const userSchema = new Mongoose.Schema(
   {
    firstname:{
        type:String,
        required:true,
    },
    last_name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate(val) {
            if (!Validator.isEmail(val)) {
              throw new Error("Please enter a valid email");
            }
          },
    },
    mobile:{
        type:Number,
        required:true,
        unique:true,
    },
    
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
    },
    status:{
        type:String,
    },

    tokens:[
        {
                token:{
                type:String,
                default:"sdfddwfegrh.swdefrgtsdfg.sdfgfdgb",
                required:true
            }
        }
    ]
})

const User = new Mongoose.model('user',userSchema)

module.exports = User
