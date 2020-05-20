<template>
  <header>
    <section>
      <div class="col1">
        <ul class="inline">
          <li><router-link to="dashboard">Dashboard</router-link></li>
          <li><router-link to="settings">Settings</router-link></li>
          <li><a @click="logout">logout</a></li>
        </ul>
      </div>
    </section>
  </header>
</template>

<script>
const fb = require('../firebase');

export default {
  methods: {
    logout() {
      fb.auth
        .signOut()
        .then(() => {
          this.$store.dispatch('clearData');
          this.$router.push('/login');
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
