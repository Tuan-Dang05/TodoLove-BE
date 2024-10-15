const { ObjectId } = require('mongodb');
const { getListService, 
    createCategory, 
    createTodo, 
    getListCategory,
    deleteTodo,
    updateTodo,
    deleteCategoryAndTodos,
    getTodoByIdCategories,
    getAll,
    toggleTodoComplete 
 } = require('../services/todo.services');

const getTodoList = async (req, res) => {
    try {
        const TodoList = await getListService();
        if (TodoList && TodoList.length > 0) {
            res.status(200).json(TodoList);
        } else {
            res.status(404).json({ message: "No todos found" });
        }
    } catch (error) {
        console.error("Error fetching todos:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getListCate = async (req, res) => {
    try{
        const CategoriesList = await getListCategory();
        if(CategoriesList && CategoriesList.length > 0 ){
            res.status(200).json(CategoriesList);
        }else{
            res.status(404).json({ message: "No todos found" });
        }
    } catch(error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    
}

const getAllCategoryWithTodo = async (req, res) => {
    try{
        const getAllTodo = await getAll();
        if(getAllTodo && getAllTodo.length > 0 ){
            res.status(200).json(getAllTodo);
        }else{
            res.status(404).json({ message: "Not found !!" });
        }
    } catch(error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Internal server error" });
    }
    
}

const createCategoryController = async (req, res) => {
    try {
        const categoryData = req.body;
        const category = await createCategory(categoryData);
        res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
        console.error("Error in createCategoryController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const createTodoController = async (req, res) => {
    try {
        const { todoData, categoryId } = req.body;
        const todo = await createTodo(todoData, categoryId);
        res.status(201).json({ message: "Todo created successfully", todo });
    } catch (error) {
        // console.error("Error in createTodoController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteTodoController = async (req, res) => {
    try {
        const { id } = req.params; 
        const isDeleted = await deleteTodo(id); 
        if (isDeleted) {
            res.status(200).json({ message: "Xoá thành công!" });
        } else {
            res.status(404).json({ message: "Todo not found" });
        }
    } catch (error) {
        console.error("Error in deleteTodoController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateTodoController = async (req, res) => {
    try {
        const { id } = req.params; // Lấy id từ params của request
        const updatedData = req.body; // Lấy dữ liệu cập nhật từ body của request

        // Kiểm tra id hợp lệ
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid id format" });
        }

        // Kiểm tra dữ liệu cập nhật có hợp lệ không
        if (!updatedData || Object.keys(updatedData).length === 0) {
            return res.status(400).json({ message: "No data provided to update" });
        }

        const isUpdated = await updateTodo(id, updatedData); // Gọi hàm updateTodo với id và updatedData

        if (isUpdated) {
            res.status(200).json({ message: "Todo updated successfully" });
        } else {
            res.status(404).json({ message: "Todo not found" });
        }
    } catch (error) {
        console.error("Error in updateTodoController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params; 
        const isDeleted = await deleteCategoryAndTodos(id); 
        if (isDeleted) {
            res.status(200).json({ message: "Xoá thành công!" });
        } else {
            res.status(404).json({ message: "Todo not found" });
        }
    } catch (error) {
        console.error("Error in deleteTodoController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getTodoByIdCategoriesController = async (req, res) => {
    try {
        const { categoryId } = req.params; // Extract categoryId from request parameters


        if (!ObjectId.isValid(categoryId)) {
            return res.status(400).json({ message: "Invalid category ID format" });
        }

        const todos = await getTodoByIdCategories(categoryId); // Fetch todos by category ID

        if (todos) {
            res.status(200).json(todos);
        } else {
            res.status(404).json({ message: "No todos found for this category" });
        }
    } catch (error) {
        console.error("Error in getTodoByIdCategoriesController:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const toggleTodoCompleteController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid todo ID format" });
        }

        const updatedTodo = await toggleTodoComplete(id);
        res.status(200).json({ message: "Todo complete status toggled successfully", todo: updatedTodo });
    } catch (error) {
        console.error("Error in toggleTodoCompleteController:", error);
        if (error.message === 'Todo not found') {
            res.status(404).json({ message: "Todo not found" });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
};


module.exports = {
    getTodoList,
    createCategoryController,
    createTodoController,
    getListCate,
    getAllCategoryWithTodo,
    deleteTodoController,
    updateTodoController,
    deleteCategoryController,
    getTodoByIdCategoriesController,
    toggleTodoCompleteController
};