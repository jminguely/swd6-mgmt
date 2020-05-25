<template>
  <div id="campaign">
    <section>
      <div class="profile">
        <div class="edit-campaign">
          <p>edit a campaign</p>
          <form>
            <input v-model.trim="campaign.name" type="text" id="campaignName" />
          </form>
          <h2>characters available</h2>
          <ul v-if="availableCharacters.length">
            <li
              v-for="character in availableCharacters"
              v-bind:key="character.id"
              class="character"
            >
              <a @click="addCharacterToCampaign(character.id)"
                >{{ character.name }}, {{ character.type }}</a
              >
            </li>
          </ul>
          <h2>players</h2>
          <ul v-if="this.campaign.characters">
            <li
              v-for="(characterId, index) in this.campaign.characters"
              v-bind:key="index"
              class="character"
            >
              <a @click="removeCharacterToCampaign(index)">
                {{ characters.filter((item) => item.id == characterId)[0].name }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';

const fb = require('../firebase');

export default {
  name: 'Campaign',
  props: {
    id: {
      type: String,
    },
  },
  data() {
    return {
      campaign: {
        name: '',
        characters: [],
      },
    };
  },
  computed: {
    ...mapState(['characters']),
    availableCharacters() {
      return this.characters.filter(
        (el) => !this.campaign.characters.includes(el.id) && el.type === 'PC',
      );
    },
  },
  watch: {
    campaign: {
      handler() {
        return this.updateCampaign();
      },
      deep: true,
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      fb.campaignsCollection
        .doc(this.id)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.exists) {
            this.campaign = querySnapshot.data();
          }
        });
    },
    updateCampaign() {
      fb.campaignsCollection
        .doc(this.id)
        .set(this.campaign)
        .then(() => {});
    },
    addCharacterToCampaign(characterId) {
      this.campaign.characters.push(characterId);
      this.updateCampaign();
    },
    removeCharacterToCampaign(index) {
      this.campaign.characters.splice(index, 1);
      this.updateCampaign();
    },
  },
};
</script>
