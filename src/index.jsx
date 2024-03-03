import { render } from "preact";

import "./style.css";
import { signal } from "@preact/signals";
import { useRef } from "preact/hooks";

const count = signal(0);
const todos = signal([]);
const todo = signal("");
const onEdit = signal(false);
const completed = signal(false);

const alert = signal("");
const alertColor = signal("bg-red-700");



// focus()
const handleChange = (e) => {
  todo.value = e.target.value;
};

const handleAdd = () => {
  
  alert.value === "Before adding new one, complete your empty todo." || "Please add at least one todo." ? "bg-red-700" : "bg-green-700"
  
  if (todos.value.find((todo) => todo.text === "")) {
    alert.value = "Before adding new one, complete your empty todo.";
    alertColor.value = "bg-red-700"
    return;
  }

  if (todo.value === "") {
    alert.value = "Please add at least one todo.";
    alertColor.value = "bg-red-700"
  } else {
    alert.value = "Todo is successfully added.";
    alertColor.value = "bg-green-700"
    todos.value = [
      ...todos.value,
      {
        id: crypto.randomUUID(),
        text: todo.value,
        onEdit: false,
        completed: completed.value,
      },
    ];
  }

  todo.value = "";
};

const handleRemove = (id) => {
  // todos.value = [...todos.value.filter((todo) => todo.id !== id)];

  alert.value = "Todo is successfully removed";
  alertColor.value = "bg-green-700"

  todos.value = todos.value.filter((todo) => todo.id !== id);
};

const handleRename = (e, text) => {
  todos.value.find((todo) => todo.text === text).text = e.target.value;
};

export function App() {
  const todoRef = useRef(null);

  const handleEdit = (id) => {
    // TODO todoRef.current.focus(); 
    onEdit.value = !onEdit.value;
    /* 
      
      todos.value = [
         ...(todos.value.find((todo) => todo.id === id).onEdit = onEdit.value),
       ];
       [
        ...(todos.value.find((todo) => todo.id === id).onEdit = onEdit.value),
      ];
    
    */
    todos.value.find((todo) => todo.id === id).onEdit = onEdit.value;
    todos.value.find((todo) => todo.id === id).completed = false;
  };

  const handleComplete = (text, id) => {
    alert.value = "Todo successfully renamed"
    alertColor.value = "bg-green-700"
    if (text === "") {
      todoRef.current.focus(); // AFTER
      return;
    }
    onEdit.value = !onEdit.value;
    todos.value.find((todo) => todo.id === id).text = text;
    todos.value.find((todo) => todo.id === id).onEdit = false;

  };

  return (
    <div className="flex flex-col gap-8 w-[540px]">
      <h1 className="self-center text-4xl">Todo</h1>
      <div className="flex flex-col gap-4">
        <h1>Count: {count.value}</h1>
        <div className="flex gap-4 justify-center">
          <button onClick={() => count.value++}>decrement</button>
          <button onClick={() => count.value--}>increment</button>
        </div>
      </div>
      <div className="flex justify-center h-[64px] px-6">
        {alert.value && (
          <p
            className={`${alertColor} self-center w-fit px-6 py-4 rounded-lg  text-white`}
          >
            {alert.value}
          </p>
        )}
      </div>
      <div className="flex justify-between">
        <input
          value={todo.value}
          onChange={handleChange}
          type="text"
          className="w-full px-4 outline-none text-xl font-semibold"
        />
        <button
          onClick={handleAdd}
          className="text-lg px-6 bg-gray-300 py-4 text-slate-700 font-semibold"
        >
          Add
        </button>
      </div>

      <div className="flex flex-col gap-6">
        {todos.value.map((todo) => {
          console.log(onEdit.value);

          return (
            <div
              key={todo.id}
              className="flex justify-between gap-24 py-6 px-4 bg-slate-700 text-lg"
            >
              <input
                ref={todoRef}
                onChange={(e) => handleRename(e, todo.text)}
                className={`px-2 py-1 bg-transparent outline-none focus:ring focus:ring-slate-300 ${
                  // AFTER outline-none
                  todo.onEdit ? "pointer-events-auto" : "pointer-events-none"
                }`}
                type="text"
                value={todo.text}
              />
              <div className="flex items-center gap-2">
                <div>
                  {
                    <span
                      onClick={
                        todo.onEdit
                          ? () => handleComplete(todo.text, todo.id)
                          : () => handleEdit(todo.id)
                      }
                      className="cursor-pointer"
                    >
                      {todo.onEdit ? "✅" : "✏️"}
                    </span>
                  }
                </div>
                <span
                  onClick={() => handleRemove(todo.id)}
                  className="cursor-pointer"
                >
                  ❌
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Resource(props) {
  return (
    <a href={props.href} target="_blank" class="resource">
      <h2>{props.title}</h2>
      <p>{props.description}</p>
    </a>
  );
}

render(<App />, document.getElementById("app"));