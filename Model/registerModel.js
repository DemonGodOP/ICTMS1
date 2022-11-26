const mongoose=require('mongoose');

const db_link='mongodb+srv://ICTMS:8900114332@cluster0.eliiulo.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(db_link)
.then(function(db){
    console.log('db connected');
})
.catch(function(err){
    console.log(err);
});

const registerSchema=mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    Event_Name:{
        type:String,
        required:true
    },
    College_Name:{
        type:String,
        required:true
    },
    Team_Name:{
        type:String,
        required:true
    },
    College_ID_Proof:{
        type:String,
        required:true
    }
});


const registerModel=mongoose.model('registerModel',registerSchema);

module.exports=registerModel;