const mongoose=require('mongoose');

const db_link='mongodb+srv://ICTMS:8900114332@cluster0.eliiulo.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(db_link)
.then(function(db){
    console.log('db connected');
})
.catch(function(err){
    console.log(err);
});

const reviewSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'review is require']
    },
    review:{
        type:String,
        required:[true,'review is require']
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
});


const reviewModel=mongoose.model('reviewModel',reviewSchema);

module.exports=reviewModel;