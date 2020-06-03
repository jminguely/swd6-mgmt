<template>
  <div id="campaign">
    <section>
      <div class="profile">
        <div class="edit-campaign">
          <div class="container-fluid">
            <div class="row" v-if="campaign">
              <div class="col-12">
                <h1>{{ campaign.name }}</h1>
                <form>
                  <div class="form-group row">
                    <label for="campaignName" class="col-sm-2 col-form-label">Name</label>
                    <input v-model.trim="campaign.name" type="text" id="campaignName" />
                  </div>
                </form>
                <div class="row">
                  <div class="col-md-6">
                    <h2>players</h2>
                    <ul v-if="this.campaign.characters">
                      <li
                        v-for="(characterId, index) in this.campaign.characters"
                        v-bind:key="index"
                        class="character"
                      >
                        <a @click="removeCharacterToCampaign(index)">
                          {{
                          characters.filter((item) => item.id == characterId)[0].name
                          }}
                          <small
                            v-if="characters.filter(
                              (item) => item.id == characterId)[0].player"
                            class="text-muted"
                          >
                            ({{
                            characters.filter((item) => item.id == characterId)[0].player }})
                          </small>
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div class="col-md-6">
                    <h2>characters available</h2>
                    <ul v-if="availableCharacters.length">
                      <li
                        v-for="character in availableCharacters"
                        v-bind:key="character.id"
                        class="character"
                      >
                        <a @click="addCharacterToCampaign(character.id)">{{ character.name }}</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="col-12 my-5">
                <router-link
                  :to="{ path: `/campaigns/${id}/encounter` }"
                  class="btn btn-lg btn-danger"
                >Fight!</router-link>
              </div>
            </div>
          </div>
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
      name: '',
    };
  },
  computed: {
    ...mapState(['characters', 'campaigns']),
    campaign() {
      return this.campaigns.find((el) => el.id === this.id);
    },
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
  methods: {
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
