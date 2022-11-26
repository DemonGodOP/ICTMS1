const mongoose=require('mongoose');
const emailValidator=require('email-validator');

const db_link='mongodb+srv://ICTMS:8900114332@cluster0.eliiulo.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(db_link)
.then(function(db){
    console.log('db connected');
})
.catch(function(err){
    console.log(err);
});

const userSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        validate:function(){
             return emailValidator.validate(this.email);
        }
    },
    username:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['Admin','Host','Participant']
    },
    password:{
        type:String,
        required:true,
        minLength:8
    },
    confirmPassword:{
        type:String,
        required:true,
        minLength:8,
        validate:function(){
            return this.confirmPassword==this.password;
        }
    }
});

// userSchema.pre('save',function(){
//     this.confirmPassword=undefined;
// });

const userModel=mongoose.model('userModel',userSchema);

module.exports=userModel;