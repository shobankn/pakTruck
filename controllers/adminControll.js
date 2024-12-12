

let Admin = (req,res)=>{
    res.send("well come  admin");

}

let Bayer = (req,res)=>{
    res.send("This is bayer")
}

let Seller = (req,res)=>{
    res.send("This is seller")
}

let User = (req,res)=>{
    res.send("This is normal user")
}


module.exports= {Admin,Bayer,Seller,User};

