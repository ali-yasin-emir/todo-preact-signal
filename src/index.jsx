import { render } from "preact";

import "./style.css";
import { signal } from "@preact/signals";

const count = signal(0);

const todos = signal([]);
const todo = signal("");

const onEdit = signal(false);

const handleChange = (e) => {
  todo.value = e.target.value;
};

const handleAdd = () => {
  if (todo.value !== "") {
    todos.value = [
      ...todos.value,
      {
        id: crypto.randomUUID(),
        text: todo.value,
        onEdit: false,
        completed: false,
      },
    ];
  }
};

const handleRemove = (id) => {
  todos.value = [...todos.value.filter((todo) => todo.id !== id)];
};

const handleEdit = (id) => {
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
};

const handleComplete = (id) => {
  onEdit.value = !onEdit.value;
  if (todo.value !== "") {
    todos.value.find((todo) => todo.id === id).text = todo.value;
    todos.value.find((todo) => todo.id === id).onEdit = false;
  }
};

export function App() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="self-start text-4xl">Todo</h1>
      <h1>Count: {count.value}</h1>
      <div className="flex gap-4 justify-center">
        <button onClick={() => count.value++}>decrement</button>
        <button onClick={() => count.value--}>increment</button>
      </div>

      <div className="flex justify-between">
        <input
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
          return (
            <div
              key={todo.id}
              className="flex justify-between gap-24 py-6 px-4 bg-slate-700 text-lg"
            >
              <input
                onChange={handleChange}
                className={`bg-transparent outline-none ${
                  onEdit.value ? "pointer-events-auto" : "pointer-events-none"
                }`}
                type="text"
                value={todo.text}
              />
              <div className="flex gap-2">
                <div>
                  {todo.onEdit ? (
                    <span
                      onClick={() => handleComplete(todo.id)}
                      className="cursor-pointer"
                    >
                      ✅
                    </span>
                  ) : (
                    <span
                      onClick={() => handleEdit(todo.id)}
                      className="cursor-pointer"
                    >
                      ✏️
                    </span>
                  )}
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
