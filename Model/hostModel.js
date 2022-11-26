const mongoose=require('mongoose');

const db_link='mongodb+srv://ICTMS:8900114332@cluster0.eliiulo.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(db_link)
.then(function(db){
    console.log('db connected');
})
.catch(function(err){
    console.log(err);
});

const hostSchema=mongoose.Schema({
    Event_Name:{
        type:String,
        required:true
    },
    Event_Type:{
        type:String,
        required:true
    },
    Event_Schedule:{
        type:String,
        required:true
    },
    Eligibility_Criteria:{
        type:String,
        required:true
    }
});


const hostModel=mongoose.model('hostModel',hostSchema);

module.exports=hostModel;