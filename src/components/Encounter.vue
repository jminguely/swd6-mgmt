<template>
  <div id="campaign">
    <section>
      <div class="profile">
        <div class="edit-campaign">
          <div class="container-fluid">
            <div class="row">
              <div class="col-12">
                <h1>{{ campaign.name }} — Fight!</h1>
                <div class="row">
                  <div class="col-md-6">
                    <h2>players</h2>
                    <ul v-if="availablePlayers">
                      <li
                        v-for="(character, index) in availablePlayers"
                        v-bind:key="index"
                        class="character"
                      >
                        <a
                          @click="removeCharacterToCampaign(index)"
                        >{{ character.name }}, {{ character.attributes.dex }}</a>
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
                        <a
                          @click="addCharacterToCampaign(character.id)"
                        >{{ character.name }}, {{ character.type }}</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div class="col-12 my-5">
                <a @click="computeInitiative" class="btn btn-lg btn-danger">Initiative!</a>
              </div>
              <div class="col-12 border">
                <h2>Round</h2>
                <ul v-if="round.length">
                  <li v-for="(step, index) in round" v-bind:key="index">
                    {{ characters.filter((item) => item.id == step.characterId)[0].name }} —
                    {{ Math.floor(step.score) }}
                  </li>
                </ul>
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
      campaign: {
        name: '',
        characters: [],
      },
      round: [],
      NPCIndexes: [],
    };
  },
  computed: {
    ...mapState(['characters']),
    availableCharacters() {
      return this.characters.filter(
        (el) => !this.campaign.characters.includes(el.id) || el.type === 'NPC',
      );
    },
    availablePlayers() {
      return this.campaign.characters.map((el) => ({
        id: el,
        name: this.characters.filter((item) => item.id === el)[0].name,
      }));
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
    addCharacterToCampaign(characterId) {
      this.campaign.characters.push(characterId);
    },
    removeCharacterToCampaign(index) {
      this.campaign.characters.splice(index, 1);
    },
    computeInitiative() {
      this.round = [];
      this.campaign.characters.forEach((characterToCompute) => {
        this.round.push({
          characterId: characterToCompute,
          score: 1 + Math.random() * 6,
        });
      });
      this.round.sort((a, b) => b.score - a.score);
    },
  },
};
</script>
