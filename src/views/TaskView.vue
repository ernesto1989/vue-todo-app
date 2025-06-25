<script setup>
import api from "../services/api";
</script>

<template>
  <nav
    class="navbar is-dark mb-4"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <a class="navbar-item has-text-weight-bold is-size-5" href="/tasks">
        📝 Categorized Tasks
      </a>

      <a
        role="button"
        class="navbar-burger"
        :class="{ 'is-active': isNavOpen }"
        @click="isNavOpen = !isNavOpen"
        aria-label="menu"
        aria-expanded="false"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>

    <div class="navbar-menu is-active">
      <div class="navbar-end">
        <div class="navbar-item">
          <p><strong>Logged in as:</strong> {{ userEmail }}</p>
        </div>
        <div class="navbar-item">
          <button class="button is-light is-small" @click="logout">
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
  <section class="section">
    <div class="container">
      <div
        class="is-flex is-justify-content-space-between is-align-items-center mb-4"
      >
        <h1 class="title">📝 Categorized ToDo Lists</h1>
        <button class="button is-primary" @click="showModal = true">
          ➕ Add Task
        </button>
      </div>

      <div class="columns">
        <div class="column" v-for="listName in lists" :key="listName">
          <h2 class="subtitle">{{ listName }}</h2>

          <div
            v-for="task in tasksByList(listName)"
            :key="task.id"
            class="card mb-3"
          >
            <div
              class="card-content is-flex is-justify-content-space-between is-align-items-center"
            >
              <div
                @click="startEditTask(task)"
                class="is-clickable"
                :title="task.task_info"
                style="
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  max-width: 200px;
                "
              >
                <span
                  :class="{
                    'has-text-grey-light': task.done,
                    'has-text-weight-semibold': !task.done,
                  }"
                >
                  {{ task.task_info }}
                </span>
              </div>

              <div class="is-flex is-align-items-center">
                <span
                  v-if="task.done"
                  class="tag is-success is-light mr-2"
                  title="Completed"
                >
                  ✔
                </span>
                <button class="delete" @click="deleteTask(task.id)"></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div class="modal" :class="{ 'is-active': showModal }">
      <div class="modal-background" @click="showModal = false"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">
            {{ editingTask ? "Edit Task" : "Add New Task" }}
          </p>
          <button
            class="delete"
            aria-label="close"
            @click="closeModal"
          ></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <label class="label">Task</label>
            <div class="control">
              <input class="input" type="text" v-model="newTaskInfo" />
            </div>
          </div>

          <div class="field">
            <label class="label">List</label>
            <div class="control">
              <input
                v-if="editingTask"
                class="input"
                type="text"
                :value="newTaskList"
                disabled
              />

              <!-- When adding: show a dropdown -->
              <div class="select is-fullwidth" v-else>
                <select v-model="newTaskList">
                  <option v-for="list in lists" :key="list" :value="list">
                    {{ list }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div class="field" v-if="editingTask">
            <label class="checkbox">
              <input type="checkbox" v-model="newTaskDone" />
              Complete
            </label>
          </div>
        </section>
        <footer class="modal-card-foot">
          <button
            class="button is-success"
            @click="editingTask ? updateTask() : addTask()"
          >
            {{ editingTask ? "Update" : "Save" }}
          </button>
          <button class="button" @click="closeModal">Cancel</button>
        </footer>
      </div>
    </div>
  </section>
</template>

<script>
const API = "http://localhost:3001/tasks";
export default {
  data() {
    return {
      newTaskInfo: "",
      newTaskList: "family",
      showModal: false,
      lists: ["family", "personal", "work", "lectures"],
      tasks: [],
      editingTask: null, // ← Task being edited
      isNavOpen: false,
      userEmail: localStorage.getItem("userEmail") || "Unknown",
    };
  },
  async mounted() {
    try {
      const res = await api.get("/tasks");
      this.tasks = await res.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      this.$router.push("/login");
    },
    async startEditTask(task) {
      this.editingTask = task;
      this.newTaskInfo = task.task_info;
      this.newTaskList = task.list;
      this.newTaskDone = task.done;
      this.showModal = true;
    },

    async closeModal() {
      this.editingTask = null;
      this.showModal = false;
      this.newTaskInfo = "";
      this.newTaskList = "family";
      this.newTaskDone = false;
    },
    async addTask() {
      if (!this.newTaskInfo.trim()) return;
      const response = await api.post("/tasks", {
        task_info: this.newTaskInfo.trim(),
        list: this.newTaskList,
        done: false,
      });
      const newTask = await response.data;
      this.tasks.push(newTask);
      this.newTaskInfo = "";
      this.newTaskList = "Family";
      this.showModal = false;
    },
    async updateTask() {
      if (!this.newTaskInfo.trim()) return;

      try {
        const response = await api.put(`http://localhost:3001/tasks`, {
          id: this.editingTask.id,
          task_info: this.newTaskInfo.trim(),
          list: this.newTaskList,
          done: this.newTaskDone,
        });

        const updatedTask = await response.data;
        const index = this.tasks.findIndex(
          (task) => task.id === updatedTask.id
        );
        if (index !== -1) {
          this.tasks.splice(index, 1, updatedTask);
        }

        this.closeModal();
      } catch (error) {
        console.error("Error updating task:", error);
      }
    },
    async deleteTask(id) {
      try {
        await api.delete(`http://localhost:3001/tasks/${id}`);

        this.tasks = this.tasks.filter((task) => task.id !== id);
      } catch (err) {
        console.error("Failed to delete task:", err);
      }
    },
    tasksByList(listName) {
      return this.tasks.filter((task) => task.list === listName);
    },
  },
};
</script>