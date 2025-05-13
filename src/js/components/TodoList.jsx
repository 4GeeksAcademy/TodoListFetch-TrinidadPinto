import React, { useEffect, useState } from "react";
import "../../styles/index.css";

const API_BASE = "https://playground.4geeks.com/todo";
const USERNAME = "TrinidadPinto";

const TodoList = () => {
    const [tareas, setTareas] = useState([]);
    const [input, setInput] = useState("");

    const cargarTareas = () => {
        fetch(`${API_BASE}/users/${USERNAME}`)
            .then(res => {
                if (!res.ok) throw new Error("Error al obtener tareas");
                return res.json();
            })
            .then(data => {
                const tareasFiltradas = data.todos.filter(t => t.label !== "init");
                setTareas(tareasFiltradas);
                console.log("Datos obtenidos:", data.todos);
            })
            .catch(err => console.error("Error al cargar tareas:", err));
    };

    useEffect(() => {
        fetch(`${API_BASE}/users/${USERNAME}`)
            .then(res => {
                if (res.status === 404) {
                    return fetch(`${API_BASE}/users/${USERNAME}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify([
                            { label: "init", is_done: false }
                        ])
                    });
                }
            })
            .then(() => cargarTareas())
            .catch(err => console.error("Error en la inicialización:", err));
    }, []);

    const manejarEntrada = (e) => {
        setInput(e.target.value);
    };

    const manejarTecla = (e) => {
        if (e.key === "Enter" && input.trim() !== "") {
            fetch(`${API_BASE}/todos/${USERNAME}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    label: input.trim(),
                    is_done: false
                }),
            })            
                .then(res => {
                    if (!res.ok) throw new Error("No se pudo actualizar");
                    return res.json();
                })
                .then(() => {
                    setInput("");
                    cargarTareas();
                })
                .catch(err => console.error("Error al agregar tarea:", err));
        }
    };

    const eliminarTarea = (indice) => {
        const tareaAEliminar = tareas[indice];
        fetch(`${API_BASE}/todos/${tareaAEliminar.id}`, {
            method: "DELETE"
        })
        .then(res => {
            if (!res.ok) throw new Error("No se pudo eliminar la tarea");
            cargarTareas();
        })
        .catch(err => console.error("Error al eliminar tarea:", err));
    };

    const limpiarTareas = () => {
        fetch(`${API_BASE}/users/${USERNAME}`, {
            method: "DELETE"
        })
        .then(res => {
            if (!res.ok) throw new Error("No se pudieron borrar las tareas");
            return fetch(`${API_BASE}/users/${USERNAME}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify([{ label: "init", is_done: false }])
            });
        })
        .then(() => cargarTareas())
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
                    tareas.map((tarea,i) => (
                        <li key={tarea.id} className="todo-item">
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
