const textbox = document.querySelector(".textbox"),
  taskList = document.querySelector(".task_list"),
  clearBtn = document.querySelector(".clear"),
  tags = document.querySelector(".task_tag");
let idCount = 0,
  dataArr = [],
  controlsTag = document.querySelector(".active").innerText.toLowerCase(),
  editId;

function saveStorage(arr) {
  let dataStr = JSON.stringify(arr);
  localStorage.setItem("tasks", dataStr);
}

function noTask() {
  taskList.innerHTML = "<span>You don't have any task here</span>";
  clearBtn.style.opacity = 0.6;
  clearBtn.style.cursor = "default";
  if (dataArr.length === 0) {
    resetTextbox();
  }
}

function renderTasks(arr, status) {
  taskList.classList.remove("overflow");
  taskList.innerHTML = "";
  if (status !== "all") {
    arr = arr.filter((item) => item.status === status);
  }
  if (arr.length > 0) {
    for (let item of arr) {
      let ischecked = "";
      if (item.status == "completed") {
        ischecked = "checked";
      }
      let li = document.createElement("li");
      li.classList.add("task");
      li.setAttribute("id", item.id);
      li.setAttribute("data-status", item.status);
      li.innerHTML = `
        <label>
          <input type="checkbox" id="checkbox${item.id}" class="checkbox"${ischecked}/>
          <div class="task_content">${item.content}</div>
          </label>
          <div class="more">
            <i class="ph-dots-three-outline-fill"></i>
            <div class="task_menu">
              <div class="edit">
                <i class="ph-pencil-simple"></i>
                <span>Edit</span>
              </div>
              <div class="delete">
                <i class="ph-trash"></i>
                <span>Delete</span>
              </div>
            </div>
          </div>
        `;
      taskList.appendChild(li);
    }
    if (taskList.offsetHeight >= 315) {
      if (!taskList.classList.contains("overflow")) {
        taskList.classList.toggle("overflow");
      }
    }
    clearBtn.style.opacity = 1;
    clearBtn.style.cursor = "pointer";
  } else {
    noTask();
  }
}

function addTask() {
  let task = {
    id: idCount++,
    content: textbox.value.trim(),
    status: "pending",
  };
  dataArr.push(task);
  saveStorage(dataArr);
}

function resetTextbox() {
  textbox.value = "";
  textbox.classList.remove("edit_mode");
  textbox.setAttribute("placeholder", "Add a new task");
}

// 載入時執行
if (localStorage.getItem("tasks") !== null) {
  dataArr = JSON.parse(localStorage.getItem("tasks"));
  if (dataArr.length > 0) {
    idCount = dataArr[dataArr.length - 1].id + 1;
    renderTasks(dataArr, controlsTag);
  }
}
// Enter輸入事件
textbox.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    let textValue = textbox.value.trim();
    if (textValue !== "") {
      if (textValue.includes("<") || textValue.includes(">")) {
        alert(`Don't input "<" & ">"`);
      } else {
        if (!textbox.classList.contains("edit_mode")) {
          addTask();
          renderTasks(dataArr, controlsTag);
          textbox.value = "";
        } else {
          // Edit模式
          let editData = dataArr.find((x) => x.id === editId);
          if (editData) {
            editData.content = textValue;
            saveStorage(dataArr);
            let elm = document.getElementById(`${editId}`);
            if (elm) {
              elm.children[0].children[1].innerHTML = textValue;
            }
          } else {
            addTask();
            renderTasks(dataArr, controlsTag);
          }
          resetTextbox();
        }
      }
    }
  }
});
// 篩選單
tags.addEventListener("click", (e) => {
  if (e.target.classList.contains("tag")) {
    let activeElm = document.querySelector(".active");
    e.target.classList.toggle("active");
    activeElm.classList.toggle("active");
    controlsTag = e.target.innerText.toLowerCase();
    renderTasks(dataArr, controlsTag);
  }
});
// ClearBtn
clearBtn.addEventListener("click", () => {
  if (clearBtn.style.cursor == "pointer") {
    dataArr = [];
    saveStorage(dataArr);
    taskList.classList.toggle("overflow");
    taskList.innerHTML = "<span>You don't have any task here</span>";
    resetTextbox();
    clearBtn.style.opacity = 0.6;
    clearBtn.style.cursor = "default";
    idCount = 0;
  }
});
// Task操作
taskList.addEventListener("click", (e) => {
  let className = e.target.className;
  if (
    className == "checkbox" ||
    className == "edit" ||
    className == "delete" ||
    className == "more"
  ) {
    let taskElm = e.target.closest("li.task");
    let taskData = dataArr.find((x) => x.id == taskElm.attributes["id"].value);
    let dataIndex = dataArr.findIndex(
      (x) => x.id == taskElm.attributes["id"].value
    );
    if (className === "checkbox") {
      if (e.target.checked) {
        taskElm.setAttribute("data-status", "completed");
        taskData.status = "completed";
      } else {
        taskElm.setAttribute("data-status", "pending");
        taskData.status = "pending";
      }
    } else if (className == "more") {
      e.target.children[1].classList.toggle("show");
    } else if (className == "edit") {
      textbox.classList.add("edit_mode");
      textbox.setAttribute("placeholder", "Edit task");
      textbox.focus();
      textbox.value = dataArr[dataIndex].content;
      editId = dataArr[dataIndex].id;
    } else if (className == "delete") {
      dataArr.splice(dataIndex, 1);
      taskElm.remove();
      if (!document.querySelector(".task")) {
        noTask();
      }
    }
    saveStorage(dataArr);
  }
});
// 跳出編輯框
document.addEventListener(
  "click",
  (e) => {
    let show = document.querySelector(".show");
    if (show) {
      if (e.target.className !== "task_menu show") {
        show.classList.remove("show");
      }
    }
  },
  true
);

textbox.addEventListener("focus", () => {
  document.querySelector(".ph-text-align-left").classList.add("focus");
});

textbox.addEventListener("blur", () => {
  document.querySelector(".ph-text-align-left").classList.remove("focus");
});
