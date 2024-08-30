const { ObjectId } = require('mongodb');
const connectToDatabase = require('../database/database');


// Lấy danh sách todo
const getListService = async () => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('TodoCollection');
        const TodoList = await collection.find({}).toArray();
        return TodoList.length ? TodoList : null;
    } catch (error) {
        console.error("Error fetching todos from MongoDB:", error);
        throw error;
    }
};

// Lấy danh sách category
const getListCategory = async () => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('CategoryCollection')
        const CategoriesList = await collection.find({}).toArray();
        return CategoriesList.length ? CategoriesList : null;
    } catch (error) {
        console.error("Error fetching categories from MongoDB:", error);
        throw error;
    }
}

// Lấy tất cả danh sách todo và category
const getAll = async () => {
    try {
        const db = await connectToDatabase();
        const categoryCollection = db.collection('CategoryCollection');
        const todoCollection = db.collection('TodoCollection');

        // Lấy tất cả Category từ CategoryCollection
        const categories = await categoryCollection.find({}).toArray();

        // Duyệt qua từng Category và lấy các Todo tương ứng
        const result = await Promise.all(categories.map(async (category) => {
            const todos = await todoCollection.find({ categoryId: category._id.toString() }).toArray();
            return {
                ...category,
                todos
            };
        }));
        return result.length ? result : null;
    } catch (error) {
        console.error("Error fetching categories with todos:", error);
        throw error;
    }
}

// Tạo category mới
const createCategory = async (categoryData) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('CategoryCollection');
        const category = {
            _id: new ObjectId(),
            ...categoryData,
            createdAt: new Date()
        };
        await collection.insertOne(category);
        return category;
    } catch (error) {
        console.error("Error creating category:", error);
        throw error;
    }
};

// Tạo Todo mới
const createTodo = async (todoData, categoryId) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('TodoCollection');
        const todo = {
            _id: new ObjectId(),
            ...todoData,
            categoryId: categoryId,
            createdAt: new Date()
        };
        await collection.insertOne(todo);
        return todo;
    } catch (error) {
        console.error("Error creating todo:", error);
        throw error;
    }
};

// Xoá todo
const deleteTodo = async (todoId) => {
    try {
        const db = await connectToDatabase();
        const todoCollection = db.collection('TodoCollection');

        // Xóa Todo dựa trên todoId
        const result = await todoCollection.deleteOne({ _id: new ObjectId(todoId) });
        return result.deletedCount ? true : false;
    } catch (error) {
        console.error("Error deleting todo:", error);
        throw error;
    }
};

// Update todo
const updateTodo = async (todoId, updatedData) => {
    try {
        const db = await connectToDatabase();
        const todoCollection = db.collection('TodoCollection');

        // Cập nhật thông tin Todo
        const result = await todoCollection.updateOne(
            { _id: new ObjectId(todoId) },
            { $set: updatedData }
        );

        return result.matchedCount ? true : false;
    } catch (error) {
        console.error("Error updating todo:", error);
        throw error;
    }
};

//xóa Category và các Todo liên quan:
const deleteCategoryAndTodos = async (categoryId) => {
    try {
        const db = await connectToDatabase();
        const categoryCollection = db.collection('CategoryCollection');
        const todoCollection = db.collection('TodoCollection');

        // Xóa tất cả các Todo liên quan đến categoryId
        await todoCollection.deleteMany({ categoryId: categoryId });

        // Xóa Category
        const result = await categoryCollection.deleteOne({ _id: new ObjectId(categoryId) });

        return result.deletedCount ? true : false;
    } catch (error) {
        console.error("Error deleting category and related todos:", error);
        throw error;
    }
};

// Lấy danh sách todo theo categoryId
const getTodoByIdCategories = async (categoryId) => {
    try {
        const db = await connectToDatabase();
        const todoCollection = db.collection('TodoCollection');

        const todos = await todoCollection.find({ categoryId: categoryId }).toArray();
        return todos.length ? todos : null;
    } catch (error) {
        console.error("Error fetching todos by categoryId from MongoDB:", error);
        throw error;
    }
};

// Toggle the complete status of a todo
const toggleTodoComplete = async (todoId) => {
    try {
        const db = await connectToDatabase();
        const todoCollection = db.collection('TodoCollection');

        // First, get the current todo item
        const todo = await todoCollection.findOne({ _id: new ObjectId(todoId) });

        if (!todo) {
            throw new Error('Todo not found');
        }

        // Toggle the complete status
        const updatedComplete = !todo.complete;

        // Update the todo item
        const result = await todoCollection.updateOne(
            { _id: new ObjectId(todoId) },
            { $set: { complete: updatedComplete } }
        );

        if (result.modifiedCount === 0) {
            throw new Error('Failed to update todo');
        }

        return {
            ...todo,
            complete: updatedComplete
        };
    } catch (error) {
        console.error("Error toggling todo complete status:", error);
        throw error;
    }
};

module.exports = {
    getListService,
    createCategory,
    createTodo,
    getListCategory,
    getAll,
    deleteTodo,
    updateTodo,
    deleteCategoryAndTodos,
    getTodoByIdCategories,
    toggleTodoComplete
};