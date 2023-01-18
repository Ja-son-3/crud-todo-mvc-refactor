//Declare Variables
const { response } = require("express")
const express = require("express")
const app = express()
const PORT = 8000
const mongoose = require("mongoose")
const connectDB = require("./config/database")
const TodoTask = require("./models/TodoTask")
require('dotenv').config({path: './config/.env'})

//Set Middleware
app.set("view engine", "ejs")
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

//Load db module in database.js
connectDB()

//Get method
app.get("/", async (req, res) => {
    try {
        TodoTask.find({}, (err, tasks) => {
            res.render("index.ejs", { todoTasks: tasks })
        })
    } catch (error) {
        response.status(500).send({message: error.message})
    }
});

//POST method
app.post('/', async (req, res) => {
    const todoTask = new TodoTask(
        {
            title: req.body.title,
            content: req.body.content
        })
    try {
        await todoTask.save()
        console.log(todoTask)
        res.redirect("/")
    } catch (error) {
        if (error) return res.status(500).send(error)
        res.redirect("/")
    }
})

//Update method
app
    .route("/edit/:id")
    .get((req,res) => {
        const id = req.params.id
        TodoTask.find({}, (err, tasks) => {
            res.render('edit.ejs', {
                todoTasks:tasks, idTask: id
            })
        })
    })
    .post((req,res) => {
        const id= req.params.id
        TodoTask.findByIdAndUpdate(
            id,
            {
                title: req.body.title,
                content: req.body.content
            },
            err => {
                if (err) return res.status(500).send(err)
                res.redirect('/')
            }
        )
    })

//Delete method
app
    .route("/remove/:id")
    .get((req, res) => {
        const id = req.params.id
        TodoTask.findByIdAndRemove(id, err => {
            if (err) return res.status(500).send(err)
            res.redirect('/')
        })
    })

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))