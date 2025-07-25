const express = require('express')
const {auth,jwt_privateKey} = require('./auth')
const cors = require('cors')
const path = require('path')
const jwt = require('jsonwebtoken')
const port = 9000
const app = express()
const mongoose = require("mongoose");
const {UserModel,TodoModel} = require('./db')
const bcrypt = require('bcrypt')
const {z} = require('zod')





mongoose.connect('mongodb+srv://root:6268547129@cluster0.yiqkrmo.mongodb.net/Todo-app-database')


app.use(cors())
app.use(express.json()) 

//this is a signup route
app.post("/signup", async (req, res) => {
    try {
        const safetyCheck= z.object({
            email: z.string().email(),
            password: z.string().min(3).max(10).startsWith('azn'),
            Name: z.string()
        })

        const safeObject = safeMail.safeParse(req.body)

       if(!safeObject.success){
        res.json({
            message : "the credential is incorrect",
            error : safeObject.error
        })
        return
       }

        const { Name, email, password } = safeobject.data
        const bcryptPassword = await bcrypt.hash(password, 10)
        await UserModel.create({
            Name: Name,
            email: email,
            password: bcryptPassword
        })

        res.json({
            message: "you are finally Signed UP"
        })
    } catch (e) {
        res.status(500).json({
            message: `error while signup: ${e.message}`
        })
    }
})

//this is a login route
app.post("/login",async (req,res)=>{
    try {
             const email =req.body.email
    const password = req.body.password

    const user = await UserModel.findOne({
        email : email,  
    })
    console.log(user)
    const passwordMatch = await bcrypt.compare(password,user.password)

if(user && passwordMatch){
    const token = jwt.sign({
        id: user._id
    }, jwt_privateKey);

    res.json({
     token : token
    });
}else{
    res.sendStatus(404).json({
        message : "incorrect credentials"
    })
}
    } catch (error) {
        res.status(500).json({
            message:`error while login ${error.message}`
        })
    }

})

//this route is to post todo
app.post("/todo", auth, async (req,res)=>{
    const userId = req.userId
const title = req.body.title
const done = req.body.done

  await TodoModel.create({
     userId : userId,
     title : title ,
     done : done

   })
res.json({
    message : "Todo is added"
})

})

//this route is to get todo
app.get("/getTodo", auth, async (req, res) => {
    const userId = req.userId
    const todos = await TodoModel.find({
        userId: userId
    })
    // Extract only the titles
    const titles = todos.map(todo => todo.title)
    res.json({
        titles: titles
    })
})


app.listen(port , ()=>{console.log(`http://localhost:${port}`)})