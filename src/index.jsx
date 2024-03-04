import { render } from "preact";

import "./style.css";
import { batch, effect, signal } from "@preact/signals";

const count = signal(0);

const LOCAL_STORAGE_KEY = ""

const getTodos = () => {
const value = localStorage.getItem(LOCAL_STORAGE_KEY)
if(value == null) return []
return JSON.parse(value)
}

const todos = signal(getTodos());


const todo = signal("");
const onEdit = signal(false);

const alert = signal("");
const alertColor = signal("bg-red-700");

const focus = signal(false);

const randomColor = signal("#000000");

effect(() => {
// storing input name
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos.value));
  console.log(todos.value)
});


const handleChange = (e) => {
  todo.value = e.target.value;
};

const handleAdd = () => {
  alert.value === "Before adding new one, complete your empty todo." ||
  "Please add at least one todo."
    ? "bg-red-700"
    : "bg-green-700";
  if (todos.value.find((todo) => todo.text === "")) {
    alert.value = "Before adding new one, complete your empty todo.";
    alertColor.value = "bg-red-700";
    return;
  }

  if (todo.value === "") {
    batch(() => {
      alert.value = "Please add at least one todo.";
      alertColor.value = "bg-red-700";
    });
  } else {
    batch(() => {
      randomColor.value = "#000000".replace(/0/g, function () {
        return (~~(Math.random() * 16)).toString(16);
      });
      alert.value = "Todo is successfully added.";
      alertColor.value = "bg-green-700";
     
    /* 
      todos.value.push({
        id: crypto.randomUUID(),
        text: todo.value,
        onEdit: false,
        done: false,
        color: randomColor.value,
        focus: focus.value,
      });

    */
   todos.value = [
        ...todos.value,
        {
          id: crypto.randomUUID(),
          text: todo.value,
          onEdit: false, // false
          done: false,
          color: randomColor.value,
          focus: focus.value,
        },
      ];
      
    });
  }

  todo.value = "";
};

const handleRemove = (id) => {
  // todos.value = [...todos.value.filter((todo) => todo.id !== id)];

  alert.value = "Todo is successfully removed";
  alertColor.value = "bg-green-700";

  todos.value = todos.value.filter((todo) => todo.id !== id);
};

const handleRename = (e, text) => {
  todos.value.find((todo) => todo.text === text).text = e.target.value;
};

const handleEdit = (id) => {
  onEdit.value = !onEdit.value
  console.log("clicked edit")
  todos.value.find((todo) => todo.id === id).onEdit = onEdit.value;
  focus.value = !focus.value;
  console.log("todo onEdit: " + todos.value.find((todo) => todo.id === id).onEdit)
  /* 
    
    todos.value = [
       ...(todos.value.find((todo) => todo.id === id).onEdit = onEdit.value),
     ];
     [s
      ...(todos.value.find((todo) => todo.id === id).onEdit = onEdit.value),
    ];
  
  */
  todos.value.find((todo) => todo.id === id).completed = false;
  todos.value.find((todo) => todo.id === id).focus = focus.value;


  /// TUM BUGLARIMIN DERMANI
  todos.value = [...todos.value]

};

const handleComplete = (text, id) => {
  console.log("clicked complete")

  focus.value = !focus.value;
  todos.value.find((todo) => todo.id === id).focus = false;
  alert.value = "Todo successfully renamed";
  alertColor.value = "bg-green-700";
  if (text === "") {
    alert.value = "Don't leave todo empty";
    alertColor.value = "bg-red-700";
    return;
  }
  todos.value.find((todo) => todo.id === id).text = text;
  todos.value.find((todo) => todo.id === id).onEdit = false;
  todos.value.find((todo) => todo.id === id).focus = false;

  /// TUM BUGLARIMIN DERMANI
  todos.value = [...todos.value]

  
};

export function App() {

  return (
    <div className="flex flex-col gap-8 w-[540px]">
      <h1 className="self-center text-4xl">Todo</h1>
      <div className="flex flex-col gap-4">
        <h1>Count: {count.value}</h1>
        <p className={`text-[${randomColor.value}]`}>
          Color: {randomColor.value ? randomColor.value : "#00000"}
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => count.value++}>decrement</button>
          <button onClick={() => count.value--}>increment</button>
        </div>
      </div>
      <div className="flex justify-center h-[64px] px-6">
        {alert.value && (
          <p
            className={`${alertColor.value} self-center w-fit px-6 py-4 rounded-lg  text-white`}
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
          console.log(todos.value );
          return (
            <div
              key={todo.id}
              className={`bg-black flex justify-between gap-24 py-6 px-4 text-lg`}
            >
              <input
                onChange={(e) => handleRename(e, todo.text)}
                className={`${
                  todo.focus && "ring ring-slate-300"
                } px-2 py-1 bg-transparent outline-none ${
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