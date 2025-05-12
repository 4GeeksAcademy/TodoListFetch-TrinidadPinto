import React, { useEffect, useState } from "react";
import "../../styles/index.css";

const API_BASE = "https://playground.4geeks.com/todo";
const USERNAME = "TrinidadPinto";

const TodoList = () => {
    const [tareas, setTareas] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        fetch(`${API_BASE}/users/${USERNAME}`)
            .then(res => {
                if (res.status === 404) {
                    return fetch(`${API_BASE}/todos/${USERNAME}`, {
                        method: "POST",
                        body: JSON.stringify([]),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                }
                return res;
            })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setTareas(data);
            })
            .catch(err => console.error("Error al obtener tareas:", err));
    }, []);

    const manejarEntrada = (e) => {
        setInput(e.target.value);
    };

    const manejarTecla = (e) => {
        if (e.key === "Enter" && input.trim() !== "") {
            const nuevaTarea = {
                label: input.trim(),
                done: false
            };
    
            const nuevasTareas = [...tareas, nuevaTarea].filter(t => 
                t && typeof t.label === "string" && t.label.trim() !== "" && typeof t.done === "boolean"
            );
    
            fetch(`${API_BASE}/todos/${USERNAME}`, {
                method: "POST",
                body: JSON.stringify(nuevasTareas),
                headers: {
                    "Content-Type": "application/json"
                }
            })            
                .then(res => {
                    if (!res.ok) throw new Error("No se pudo actualizar");
                    return res.json();
                })
                .then(() => {
                    setTareas(nuevasTareas);
                    setInput("");
                })
                .catch(err => console.error("Error al agregar tarea:", err));
        }
    };

    const eliminarTarea = (indice) => {
        const nuevasTareas = tareas
            .filter((_, i) => i !== indice)
            .map(t => ({
                label: t.label || "Tarea sin nombre",
                done: typeof t.done === "boolean" ? t.done : false
            }));

            fetch(`${API_BASE}/todos/${USERNAME}`, {
            method: "PUT",
            body: JSON.stringify(nuevasTareas),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(() => {
                setTareas(nuevasTareas);
            })
            .catch(err => console.error("Error al eliminar tarea:", err));
    };

    const limpiarTareas = () => {
        fetch(`${API_BASE}/todos/${USERNAME}`, {
            method: "PUT",
            body: JSON.stringify([]),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(() => {
                setTareas([]); 
            })
            .catch(err => console.error("Error al limpiar todas las tareas:", err));
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
                            {tarea.label}
                            <span className="delete" onClick={() => eliminarTarea(i)}>
                                <i className="fa-solid fa-xmark"></i>
                            </span>
                        </li>
                    ))
                )}
            </ul>
            <div className="counter">{tareas.length} tareas</div>
            <button className="clear-all" onClick={limpiarTareas}>
                Limpiar todas las tareas
            </button>
        </div>
    );
};

export default TodoList;
