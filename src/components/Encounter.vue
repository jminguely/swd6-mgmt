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
                    <ol v-if="availablePlayers">
                      <li
                        v-for="(character, index) in availablePlayers"
                        v-bind:key="index"
                        class="character"
                      >
                        <a @click="removeCharacterToCampaign(index)">
                          {{ character.name }},
                          {{ character.attributes ? character.attributes.dex || '2d' : '2d' }}
                        </a>
                      </li>
                    </ol>
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
              <div class="col-10 offset-1 border py-3">
                <h2>Round</h2>
                <ol v-if="round.length">
                  <li v-for="(step, index) in round" v-bind:key="index">
                    {{ characters.find((item) => item.id == step.characterId).name }}
                    <small
                      class="text-muted"
                    >
                      (
                      <span v-for="(roll, index) in step.rolls.dices" v-bind:key="index">
                        <span
                          :class="{
                            'text-striked' : roll.isRollValid == false,
                            'font-weight-bold' : roll.isRollWild == true,
                            'text-danger' : roll.isRollCritFail == true,
                            'text-success' : roll.isRollCritWin == true}"
                        >{{roll.result}}</span>
                        <!-- eslint-disable -->
                        <span
                          v-if="roll.isRollCritWin"
                          class="ml-1"
                        >+ [{{ step.rolls.wildRolls.join(" + ") }}]</span>
                        <!-- eslint-enable -->

                        <span v-if="index+1 != step.rolls.dices.length" class="mx-1">+</span>
                      </span>
                      )
                      =
                      <span
                        class="font-weight-bold"
                      >{{step.rolls.score}}</span>
                    </small>
                  </li>
                </ol>
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
        name: this.characters.find((item) => item.id === el).name,
        attributes: this.characters.find((item) => item.id === el).attributes,
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
    rollWildDice(wildRolls) {
      const roll = Math.floor(Math.random() * 6 + 1);
      wildRolls.push(roll);

      if (roll === 6) {
        return this.rollWildDice(wildRolls);
      }
      return wildRolls;
    },
    rollDices(diceValue) {
      const regexp = /^(\d*)d\+?(\d*)?$/i;

      const rollQty = regexp.exec(diceValue)[1];
      const rollModifier = regexp.exec(diceValue)[2] || 0;

      const dices = [];
      let wildRolls = [];
      let rollsHaveCritFail = false;
      let rollsHaveCritWin = false;

      for (let i = 0; i < rollQty; i += 1) {
        const roll = Math.floor(Math.random() * 6 + 1);
        const isRollWild = i === 0;
        let isRollCritFail = false;
        let isRollCritWin = false;

        if (isRollWild && roll === 6) {
          isRollCritWin = true;
          wildRolls = this.rollWildDice([]);
        }

        if (isRollWild && roll === 1) {
          isRollCritFail = true;
        }

        if (isRollCritWin) rollsHaveCritWin = true;
        if (isRollCritFail) rollsHaveCritFail = true;

        dices.push({
          type: 'd6',
          isRollWild,
          result: roll,
          isRollCritFail,
          isRollCritWin,
          isRollValid: true,
        });
      }

      let score = dices.reduce((a, b) => ({ result: a.result + b.result })).result;

      if (rollsHaveCritWin) {
        score += wildRolls.reduce((a, b) => a + b);
      }

      if (rollsHaveCritFail) {
        const maxDice = dices.reduce((a, b) => (a.result > b.result ? a : b));
        maxDice.isRollValid = false;
        score -= maxDice.result;
      }

      dices.push({
        type: 'modifier',
        result: rollModifier,
      });

      return { score, dices, wildRolls };
    },
    computeInitiative() {
      this.round = [];
      this.campaign.characters.forEach((characterIdToCompute) => {
        const characterToCompute = this.characters.find((item) => item.id === characterIdToCompute);
        const dexDice = characterToCompute.attributes
          ? characterToCompute.attributes.dex || '2d'
          : '2d';

        this.round.push({
          characterId: characterIdToCompute,
          rolls: this.rollDices(dexDice),
        });
      });
      this.round.sort((a, b) => b.rolls.score - a.rolls.score);
    },
  },
};
</script>
