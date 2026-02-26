import { Users } from "../Model/authModel.js";

export const login=async(req,res)=>{
    const body=req.body;
    if(!body.email){
        res.status(500).send("Email is required");
        return;
    }
    if(!body.password){
        res.status(500).send("Password is required");
        return;
    }
    if(body.email===""){
        res.status(500).send("Email is required");
        return;
    }
    if(body.password===""){
        res.status(500).send("Password is required");
        return;
    }
    const user=await Users.findOne({where:{customerEmail:body.email }});
    if(!user){
        res.status(500).send("User not found");
        return;
    }
    if(user.customerPassword!==body.password){
        res.status(500).send("Invalid password");
        return;
    }


}