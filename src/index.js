import "./style.css";
import Task from "./core/Task";

let task = new Task("do work", "simple desc", "02.10.2025");
console.log(task);
localStorage.setItem("task1", JSON.stringify(task));

document.querySelector("#app").innerHTML = `
  <article>
    <header>
      <h2>Webpack + Pico.css ready!</h2>
    </header>
    <p>This is a starter project with Pico.css</p>
  </article>
`;
