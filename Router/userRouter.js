const express = require("express");
const userRouter=express.Router();
const userModel=require('../Model/userModel');
const reviewModel=require('../Model/reviewModel');
const hostModel=require('../Model/hostModel');
const registerModel=require('../Model/registerModel');
const cookieParser=require('cookie-parser');
userRouter.use(cookieParser())
const jwt=require('jsonwebtoken');
const JWT_KEY='kghjhv4j34hj3v4';


userRouter
.route('/host')
.get(protectRoute,getHost)
.post(protectRoute,postHost);

userRouter
.route('/about')
.get(protectRoute,getAbout);

userRouter
.route('/details')
.get(protectRoute,details)

userRouter
.route('/register')
.get(protectRoute,getRegister)
.post(protectRoute,postResgister);

userRouter
.route('/login')
.get(getloginUser)
.post(postloginUser);

userRouter
.route('/getTournament')
.get(protectRoute,getTournamentDetails);

userRouter
.route('/AlluserProfile/:id')
.get(protectRoute,isAuthorised(['admin']),getAllUser)

userRouter
.route('/userProfile/:id')
.get(protectRoute,getUser)

userRouter
.route('/logout')
.get(logout)

//user options
userRouter
.route("/Profile/:id")
.patch(patchUser)
.delete(deleteUser)

userRouter
.route("/getReview")
.get(protectRoute,isAuthorised(['admin']),getAllReviews);

userRouter
.route("/createReview")
.get(protectRoute,getReview)
.post(protectRoute,postReview);

userRouter
.route("/homepage")
.get(protectRoute,homepage)

userRouter
.route('/')
.get(getSignUp)
.post(postSignup);

function homepage(req,res){
    res.sendFile('Homepage.html',{root:__dirname});
}

function getAbout(req,res){
    res.sendFile('about.html',{root:__dirname});
}

function details(req,res){
    res.sendFile('Details.html',{root:__dirname});
}

function getReview(req,res){
    res.sendFile('review.html',{root:__dirname});
}

async function postReview(req,res){
try{
        let dataObj=req.body;
        let user=await reviewModel.create(dataObj);
        if(user){
        res.json({
            message:"review created",
            data:user
        });
        }
        else{
            res.json({
                message:"error while reviewing"
            })
        }
    }
catch(err){
    res.json({
        message:err.message
    })
}
}

async function getAllUser(req,res){
    let user=await userModel.find();
    if(user){
        res.json({
            message:"users Retrieved",
            data:user
        });
    }
}

async function getTournamentDetails(req,res){
    let host=await hostModel.find();
    if(host){
        res.status(200).json({
            data:host
        });
    }
}

async function getUser(req,res){
    let token=req.params.id;
    let user=await userModel.findById(token);
    if(user){
        return res.json(user);
    }
    else{
        return res.json({
            message:'users not found'
        })
    }
}

async function patchUser(req,res){
        let token=req.params.id;
        let user=await userModel.findById(token);
        let dataToBeUpdated=req.body;
        if(user){
            const keys=[];
            for(let key in dataToBeUpdated){
                keys.push(key);
            }

            for(let i=0;i<keys.length;i++){
                user[keys[i]]=dataToBeUpdated[keys[i]]
            }
            const updatedData=await user.save();
            res.json({
                message:"Data updated Sucessfully",
                data:user
            });
        }
        else{
            res.json({
                message:"user not found"
            })
        }
    }


async function deleteUser(req,res){
    try{
        let token=req.params.id;
        let id=await userModel.findById(token);
        let user=await userModel.findByIdAndDelete(id);
        if(!user){
            res.json({
                message:'user not found'
            })
        }
        res.json({
            message:"Data has been Deleted",
            data:user
        });
    }
    catch(err){
        res.json({
            message:err.message
        })
    }
}

function setCookies(req,res){
   res.cookie('isLoggedIn',true,{maxAge:1000*60*60*24, secure:true, httpOnly:true})
   res.cookie('isAMember',true)
   res.send('cookies has been set')
}

function getCookies(req,res){
    let cookies=req.cookies.login
    console.log(cookies)
    res.send('cookies received')
}


async function protectRoute(req,res,next){
    let token;
    if(req.cookies.login){
        token=req.cookies.login
        let payload=jwt.verify(token,JWT_KEY)
        if(payload){
            const user=await userModel.findById(payload.payload)
            req.role=user.role;
            req.id=user.id;
            next();
        }
        else{
            return res.json({
                message:"user not verified."
            })
        }

    }
    else{
        const client=req.get('User-Agent');
        if(client.includes("Google")==true){
            return res.redirect('/login');
        }
        return res.json({
            message:"Operation not allowed. Login First"
        })
    }
}


function getSignUp(req,res){
    res.sendFile('signup.html',{root:__dirname});
}

async function postSignup(req,res){
    let dataObj=req.body;
    let user=await userModel.create(dataObj);
    res.status(200).json({
        message:"Signed up"
    });
}

function getHost(req,res){
    res.sendFile('host.html',{root:__dirname});
}

async function postHost(req,res){
    let dataObj=req.body;
    let user=await hostModel.create(dataObj);
    res.status(200).json({
        message:"Hosting Successful"
    });
}

function getRegister(req,res){
    res.sendFile('register.html',{root:__dirname});
}

async function postResgister(req,res){
    let dataObj=req.body;
    let user=await registerModel.create(dataObj);
    res.status(200).json({
        message:"Registration Successful"
    });
}

function getloginUser(req,res){
    res.sendFile('login.html',{root:__dirname});
}


async function postloginUser(req,res){
try{
    let data=req.body;
    if(data.email){
        let user=await userModel.findOne({email:data.email});
        if(user){
            if(user.password==data.password){
                    let uid=user['_id'];
                    let token=jwt.sign({payload:uid},JWT_KEY)
                    res.cookie('login',token,{httpOnly:true});
                    console.log("user logged in: ",data);
                    res.status(200).json({
                        data:1
                    })
            }
            else{
                    return res.json({
                        message:"Wrong Credential Entered",
                        data:0
                    })
            }
        }
        else{
            return res.status(200).json({
            message: "User not Found",
            data:0
        })
    }
}
    else{
        return res.status(200).json({
        message: "Please Enter a Valid Email",
        data:0
    })
    }
}
catch(err){
      return res.json({
            message:err.message
      })
}
}

function isAuthorised(roles){
     return async function(req,res,next){
        let token=req.params.id;
        let id=await userModel.findById(token);
        if(roles.includes(id.role)==true){
            next();
        }
        else{
            res.status(401).json({
                message:"Operation not allowed"
            })
        }
     }
}


function logout(req,res){
    res.cookie('login','',{maxAge:1});
    res.sendFile('signup.html',{root:__dirname})
}

async function getAllReviews(req,res){
    const reviews=await reviewModel.find();
    if(reviews){
        return res.json({
            message:"Reviews Retrived",
            data:reviews
        })
    }
    else{
        return res.json({
            message:'review not found'
        })
    }

}

function getReview(req,res){
    res.sendFile('review.html',{root:__dirname});
}

async function postReview(req,res){
try{
        let dataObj=req.body;
        let user=await reviewModel.create(dataObj);
        if(user){
        res.json({
            message:"review created",
            data:user
        });
        }
        else{
            res.json({
                message:"error while reviewing"
            })
        }
    }
catch(err){
    res.json({
        message:err.message
    })
}
}
module.exports=userRouter;
