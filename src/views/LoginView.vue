<template>
  <section class="section">
    <div class="container" style="max-width: 500px">
      <h1 class="title">Login</h1>

      <div class="box">
        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input
              v-model="email"
              class="input"
              type="email"
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div class="field">
          <label class="label">Password</label>
          <div class="control has-icons-right">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="input"
              placeholder="••••••••"
            />
            <span
              class="icon is-small is-right is-clickable"
              @click="showPassword = !showPassword"
              title="Toggle visibility"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </span>
          </div>
        </div>

        <div class="field">
          <button class="button is-primary" @click="login">Login</button>
        </div>
        <p class="mt-4">
          Don't have an account?
          <router-link to="/register" class="has-text-link"
            >Register here</router-link
          >
        </p>
        <p class="has-text-danger" v-if="error">{{ error }}</p>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      error: "",
    };
  },
  methods: {
    async login() {
      try {
        const res = await fetch("http://localhost:3001/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
          }),
        });

        if (!res.ok) throw new Error("Login failed");
        const data = await res.json();

        // Store token in localStorage
        localStorage.setItem("token", data.token);
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        localStorage.setItem('userEmail', payload.email);
        
        // Redirect to /tasks
        this.$router.push("/tasks");
      } catch (err) {
        this.error = "Invalid email or password";
      }
    },
  },
};
</script>