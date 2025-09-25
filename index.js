import express from "express"
import cors from "cors"
import { configDB } from "./configDB.js"
import mysql from "mysql2/promise"

const app = express()
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 8000

let connection

try {
    connection = await mysql.createConnection(configDB)
} catch (error) {
    console.log(error);
}

app.get("/todos", async(req,resp)=> {
    try {
        const sql = 'SELECT * FROM todolist ORDER BY timestamp DESC;'
        const [rows, fields] = await connection.execute(sql)
        console.log(rows);
        console.log(fields);
        resp.send(rows)
        
    } catch (error) {
        console.log(error);
    }
})

app.post("/todos", async(req,resp)=> {
    if (!req.body) return resp.json({msg:"Hiányos adat!"}) 
    const {task} = req?.body
    if (!task) return resp.json({msg:"Hiányos adat!"}) 
    try {
        const sql = `INSERT INTO todolist (task) VALUES (?)`
        const values = [task]
        const [result] = await connection.execute(sql, values)
        console.log(result);
        resp.status(201).json({msg:"Sikeres hozzáadás!"})
        
    } catch (error) {
        console.log(error);
    }
})

app.delete("/todos/:id", async(req,resp)=> {
    const {id} = req.params
    try {
        const sql = `DELETE FROM todolist WHERE id = ?`
        const values = [id]
        const [result] = await connection.execute(sql, values)
        if(result.affectedRows > 0) {
           return resp.status(201).json({msg:"Sikeres törlés!"})}
        resp.json({msg:"Nem létező index!"})
    } catch (error) {
        console.log(error);
    }
})



app.patch("/todos/:id", async(req,resp)=> {
    const {id} = req.params
    try {
        const sql = `update todolist set completed=NOT completed WHERE id = ?`
        const values = [id]
        const [result] = await connection.execute(sql, values)
        if(result.affectedRows > 0) {
           return resp.status(201).json({msg:"Sikeres módosítás!"})}
        resp.json({msg:"Nem létező index!"})
    } catch (error) {
        console.log(error);
    }
})


app.listen(port,()=>console.log(`Server listening on port ${port}`))