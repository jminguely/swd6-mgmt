<template>
  <header>
    <section>
      <nav class="navbar navbar-expand navbar-dark bg-dark mb-3">
        <a class="navbar-brand" href="/">SWD6 MGMT</a>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav d-flex w-100">
            <li class="nav-item">
              <router-link class="nav-link" to="/campaigns">Campaigns</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/characters">Characters</router-link>
            </li>
            <li class="nav-item ml-sm-auto">
              <a href="#" class="btn btn-outline-danger" @click="logout">Logout</a>
            </li>
          </ul>
        </div>
      </nav>
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
        .catch(() => {});
    },
  },
};
</script>
