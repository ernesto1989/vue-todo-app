<template>
  <section class="section">
    <div class="container" style="max-width: 500px">
      <h1 class="title">Register</h1>

      <div class="box">
        <!-- Email -->
        <div class="field">
          <label class="label">Email</label>
          <div class="control">
            <input
              v-model="email"
              class="input"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <p class="help is-danger" v-if="emailError">{{ emailError }}</p>
        </div>

        <!-- Password -->
        <div class="field">
          <label class="label">Password</label>
          <div class="control has-icons-right">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="input"
              placeholder="••••••••"
              required
            />
            <span
              class="icon is-small is-right is-clickable"
              @click="showPassword = !showPassword"
              title="Toggle visibility"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </span>
          </div>
          <p class="help is-danger" v-if="passwordError">{{ passwordError }}</p>
        </div>

        <!-- Confirm Password -->
        <div class="field">
          <label class="label">Confirm Password</label>
          <div class="control has-icons-right">
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="input"
              placeholder="••••••••"
              required
            />
            <span
              class="icon is-small is-right is-clickable"
              @click="showConfirmPassword = !showConfirmPassword"
              title="Toggle visibility"
            >
              <i
                :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
              ></i>
            </span>
          </div>
          <p class="help is-danger" v-if="confirmPasswordError">
            {{ confirmPasswordError }}
          </p>
        </div>

        <!-- Submit -->
        <div class="field">
          <button class="button is-primary" @click="register">Register</button>
        </div>

        <!-- Result -->
        <p class="has-text-success" v-if="success">{{ success }}</p>
        <p class="has-text-danger" v-if="serverError">{{ serverError }}</p>
        <p class="mt-4">
            Already have an account?
        <router-link to="/login" class="has-text-link">Log in here</router-link>
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import api from "../services/api";

export default {
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      emailError: "",
      passwordError: "",
      confirmPasswordError: "",
      showPassword: false,
      showConfirmPassword: false,
      serverError: "",
      success: "",
    };
  },
  methods: {
    validateForm() {
      this.emailError = "";
      this.passwordError = "";
      this.confirmPasswordError = "";
      this.serverError = "";
      this.success = "";

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordStrength = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;

      let valid = true;

      if (!emailRegex.test(this.email)) {
        this.emailError = "Please enter a valid email address.";
        valid = false;
      }

      if (!passwordStrength.test(this.password)) {
        this.passwordError =
          "Password must be at least 8 characters long and include letters and numbers.";
        valid = false;
      }

      if (this.password !== this.confirmPassword) {
        this.confirmPasswordError = "Passwords do not match.";
        valid = false;
      }

      return valid;
    },

    async register() {
      if (!this.validateForm()) return;

      try {
        const res = await api.post("/register", {
          email: this.email,
          password: this.password,
        });

        this.success =
          "Registration successful. Check your email to confirm your account.";
        this.email = "";
        this.password = "";
        this.confirmPassword = "";
      } catch (err) {
        this.serverError =
          err.response?.data?.message ||
          "An error occurred during registration.";
      }
    },
  },
};
</script>