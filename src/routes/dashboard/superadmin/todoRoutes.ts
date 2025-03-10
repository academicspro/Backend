import express from "express";
import { createTodo, deleteTodo, getTodoById, getTodos, updateTodo } from "../../../controller/superadmin/todoController";

const  router = express.Router();


router.post("/todo", createTodo);
router.get("/todos", getTodos);
router.get("/todo/:id", getTodoById);
router.put("/todo/:id", updateTodo);
router.delete("/todo/:id", deleteTodo);


export default router;