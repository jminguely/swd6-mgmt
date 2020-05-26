<template>
  <div id="character">
    <section class="container-fluid">
      <div class="profile">
        <div class="edit-character">
          <h1>{{ character.name }}</h1>
          <form>
            <div class="form-group row">
              <label for="characterName" class="col-sm-2 col-form-label">Name</label>
              <input v-model.trim="character.name" type="text" id="characterName" />
            </div>
            <div class="form-group row">
              <label for="characterType" class="col-sm-2 col-form-label">Type</label>
              <select v-model="character.type" id="characterType">
                <option disabled value>Choose</option>
                <option value="PC">PC</option>
                <option value="NPC">NPC</option>
              </select>
            </div>
            <h2>Attributes</h2>
            <div
              class="form-group row"
              v-for="(attribute, key, index) in character.attributes"
              v-bind:key="index"
            >
              <label
                for="characterName"
                class="col-sm-2 col-form-label"
              >{{ $t(`attributes.${key}`) }}</label>

              <input v-model.trim="character.attributes[key]" type="text" id="characterName" />
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
const fb = require('../firebase');

export default {
  name: 'Character',
  components: {},
  props: {
    id: {
      type: String,
    },
  },
  data() {
    return {
      character: {},
    };
  },
  watch: {
    character: {
      handler() {
        return this.updateCharacter();
      },
      deep: true,
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      fb.charactersCollection
        .doc(this.id)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.exists) {
            this.character = querySnapshot.data();
          }
        });
    },
    updateCharacter() {
      fb.charactersCollection
        .doc(this.id)
        .set(this.character)
        .then(() => {});
    },
  },
};
</script>
