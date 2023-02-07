import React, { useEffect, useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import { 
    setTodoList, 
    addTodo,
    sortTodo,
    updateTodo,
    toggleCompleted,
} from "../ToDoSlice"; 
import { TiPencil } from "react-icons/ti";
import { BsTrash } from "react-icons/bs";
import empty from "../assets/empty.jpg";

const ToDoList = () => {

    const dispatch = useDispatch();
    const todoList = useSelector(state => state.todo.todoList);
    const sortCriteria = useSelector(state => state.todo.sortCriteria);
    const [showModal, setShowModal] = useState(false);
    const [currentToDo, setCurrentToDo] = useState(null);
    const [newTask, setNewTask] = useState("");
    console.log(newTask)

    const handleAddToDo = (task) => {
        if(task.trim().length === 0){
            alert("Por favor, digite uma task")
        }else{
            dispatch(
                addTodo({
                    task: task,
                    id: Date.now(),
                })
            );
            setNewTask("");
            setShowModal(true);
        }
    }

    const handleDeleteToDo = (id) => {
        const updatedToDoList = todoList.filter(todo => todo.id != id);
        dispatch(setTodoList(updatedToDoList));
        localStorage.setItem("todoList", JSON.stringify(updatedToDoList));
    }

    const handleSort = (sortCriteria) => {
        dispatch(sortTodo(sortCriteria))
    }

    const handleToggleCompleted = (id) => {
        dispatch(toggleCompleted({id}));
    }

    const handleUpdateToDoList = (id, task) =>{
        if(task.trim().length === 0){
            alert("Por favor, digite uma task")
        }else{
            dispatch(
                updateTodo({
                    task: task,
                    id: id,
                })
            );
            setShowModal(false);
        }
    }

    const sortToDoList = todoList.filter((todo) => {
        if (sortCriteria === "All") return true
        if (sortCriteria === "Completed" && todo.completed) return true
        if (sortCriteria === "Not Completed" && !todo.completed) return true
        return false;
    })

    useEffect(() => {
        if (todoList.length > 0) {
            localStorage.setItem("todolist", JSON.stringify(todoList));
        }
    }, [todoList]);

    useEffect(() => {
        const localTodoList = JSON.parse(localStorage.getItem("todoList"));
        if(localTodoList){
            dispatch(setTodoList(localTodoList));
        }
    }, []);

    return (
        <div>
            {showModal && (
                <div className="fixed w-full 
                left-0 top-0 h-full bg-transparentBlack 
                flex items-center justify-center">
                    <div className ="bg-white p-10 rounded-md">
                        <input 
                            type = "text"
                            className="border px-20 py-3 rounded-md outline-none mb-8"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder= {
                              currentToDo ? "Edite a sua task aqui" : "Digite sua task aqui"  
                            }    
                        />
                        <div className = "flex justify-between">
                            {currentToDo ? (
                                <>
                                    <button onClick={() => {
                                        setShowModal(false);
                                        handleUpdateToDoList(currentToDo.id, newTask);
                                    }}
                                    className = "bg-sunsetOrange rounded-md text-white py-3 px-10"
                                    >Salvar</button>
                                    <button className = "bg-Tangaroa rounded-md text-white py-3 px-10"
                                        onClick={() => {setShowModal(false)}}>Cancelar</button>
                                </>
                            ) : ( 
                                <>
                                    <button
                                        className = "bg-Tangaroa rounded-md text-white py-3 px-10"
                                        onClick={() => {setShowModal(false)}}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        className = "bg-sunsetOrange rounded-md text-white py-3 px-10"
                                        onClick={() => {handleAddToDo(newTask); setShowModal(false)}}>
                                            Salvar
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div className ="flex items-center justify-center flex col">
                {todoList.length === 0 ? ( 
                <>
                <div className = "mb-8">
                    <div className = "sm:w-[500px] sm:h-[500px] min-w-[250px]">
                        <img src={empty} alt = ""></img>
                    </div>
                    <p>Você não possui nenhuma task. Por favor, crie uma.</p>
                </div>
                </> ) : ( 
                <div className="container mx-auto mt-6">
                    <div className="flex justify-center mb-6">
                        <select onChange = {(e) => handleSort(e.target.value)}
                        className="p-1 outline-none">
                            <option className="text-sm" value="All">Todas</option>
                            <option className="text-sm" value="Completed">Completas</option>
                            <option className="text-sm" value="Not Completed">Não completas</option>
                        </select>
                    </div>
                    <div>
                    {sortToDoList.map((todo) => (
                        <div 
                            key={todo.id} 
                            className="flex items-center 
                            justify-between mb-6 bg-Tangaroa 
                            mx-auto w-full md:w-[75%] rounded-md p-4"
                        >
                            <div
                                className={`${todo.completed ? "line-through text-greenTeal" : "text-sunsetOrange"}`}
                                onClick={() => {handleToggleCompleted(todo.id)}}
                            >
                                {todo.task}
                            </div>
                            <div>
                                <button 
                                    className="bg-blue-500 text-white p-1 
                                    rounded-md ml-2"
                                    onClick={() => {
                                        setShowModal(true); 
                                        setCurrentToDo(todo);
                                        setNewTask(todo.task);
                                    }}>
                                        <TiPencil />
                                    </button>
                                <button 
                                    className="bg-sunsetOrange text-white p-1 
                                    rounded-md ml-2"
                                    onClick={() => handleDeleteToDo(todo.id)}>
                                        <BsTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                </div> </div>
                )}
            </div>
            <div className ="flex items-center justify-center flex col">
                <button 
                className ="bg-sunsetOrange 
                text-center text-white py-3 px-10 rounded-md"
                onClick={() => setShowModal(true)}>
                    Adicionar Task
                </button>
            </div>
        </div>
    );
}

export default ToDoList;