import { Router } from 'express';
import { ObjectId } from 'mongodb';
import { getConnectedClient } from './database.js';

// router.js 

const getCollection = () => {
  try {
    const client = getConnectedClient();
    const collection = client.db("TodoDB").collection("Todos")
    return collection;
  }catch(error){
    console.error(`In Mongodb can't create a DB and collections ${error}`)
  }
}

const router = Router()
// GET /todos
router.get('/todos', async (req, res) => {
  try {
    const collection = getCollection()
    const todos = await collection.find({}).toArray()
    res.status(200).json(todos)
  } catch (error) {
    console.error("Fetching todos failed:", error)
    res.status(500).json({ message: "Server error" })
  }
})
// POST /todos 
router.post('/todos', async (req, res) => {
  try {
    const collection = getCollection()
    let { todo } = req.body;
    if (!todo) {
      return res.status(400).json({ mssg: "error no todo found" })
    }

    todo = (typeof todo === "string") ? todo : JSON.stringify(todo)

    const newTodos = await collection.insertOne({ todo, status: false });

    res.status(201).json({ _id: newTodos.insertedId, todo, status: false })
  } catch (error) {
    console.error("Posting error happning: ", error)
  }
})
// DELETE /todos/:id
router.delete('/todos/:id', async (req, res) => {
  try {
    const collection = getCollection()
    const _id = new ObjectId(req.params.id)
    const deletedTodo = await collection.deleteOne({ _id })

    res.status(200).json(deletedTodo)
  } catch (error) {
    console.error("deleted", error)
  }
})
// PUT /todos/:id
router.put('/todos/:id', async (req, res) => {
  try {
    const collection = getCollection()
    const _id = new ObjectId(req.params.id)
    const { status } = req.body

    if (typeof status !== "boolean") {
      return res.status(400).json({ mssg: "invalid status" })
    }
    const updateTodo = await collection.updateOne({ _id }, { $set: { status: status } })

    res.status(200).json(updateTodo)
  } catch (error) {
    console.error("updating error", error)
    res.status(500).json({ mssg: "Server error" })
  }
})

export default router