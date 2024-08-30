const express = require('express');
const Todorouter = express.Router();
const { 
    getTodoList,
    getListCate, 
    createCategoryController, 
    createTodoController, 
    getAllCategoryWithTodo,
    deleteTodoController,
    updateTodoController,
    deleteCategoryController,
    getTodoByIdCategoriesController,
    toggleTodoCompleteController
} = require('../controllers/todo.controller');

Todorouter.get("/", getTodoList);
Todorouter.get("/category/:categoryId", getTodoByIdCategoriesController);
Todorouter.get("/category", getListCate);
Todorouter.get("/all", getAllCategoryWithTodo);
Todorouter.patch('/:id/toggle-complete', toggleTodoCompleteController);
Todorouter.post("/category", createCategoryController);
Todorouter.post("/", createTodoController);
Todorouter.delete('/:id',deleteTodoController)
Todorouter.delete('/category/:id',deleteCategoryController)
Todorouter.put("/:id", updateTodoController)

module.exports = Todorouter;