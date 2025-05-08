import React, { useState } from "react";
import "../../styles/index.css";

const TodoList = () => {
    const [tareas, setTareas] = useState([]);
    const [input, setInput] = useState("");

    const manejarEntrada = (e) => {
        setInput(e.target.value);
    };

    const manejarTecla = (e) => {
        if (e.key === "Enter" && input.trim() !== "") {
            setTareas([...tareas, input.trim()]);
            setInput("");
        }
    };

    const eliminarTarea = (indice) => {
        const nuevasTareas = tareas.filter((_, i) => i !== indice);
        setTareas(nuevasTareas);
    };

    return (
        <div className="todo-container">
            <h1>Lista de Tareas</h1>
            <input
                type="text"
                value={input}
                onChange={manejarEntrada}
                onKeyDown={manejarTecla}
                placeholder="¿Qué necesitas hacer?"
                className="todo-input"
            />
            <ul className="todo-list">
                {tareas.length === 0 ? (
                    <li className="empty">No hay tareas, añadir tareas</li>
                ) : (
                    tareas.map((tarea, i) => (
                    <li key={i} className="todo-item">
                        {tarea}
                        <span className="delete" onClick={() => eliminarTarea(i)}>
                            <i class="fa-solid fa-xmark"></i>
                        </span>
                    </li>
                    ))
                )}
            </ul>
            <div className="counter">{tareas.length} tareas</div>
        </div>
    );
};

export default TodoList;
