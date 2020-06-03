<template>
  <div id="encounter">
    <section>
      <div class="profile">
        <div class="edit-encounter">
          <div class="container-fluid">
            <div class="row py-4">
              <div class="col-12">
                <h1>Fight!</h1>
                <div class="row">
                  <div class="col-md-6">
                    <h2>Joueurs en combat</h2>
                    <div v-if="availablePlayers">
                      <a
                        v-for="(character, index) in availablePlayers"
                        v-bind:key="index"
                        @click="removeCharacterToEncounter(index)"
                        class="btn btn-sm mb-2 mr-2"
                        :class="{
                          'btn-secondary': character.type == 'NPC',
                          'btn-primary': character.type != 'NPC',
                        }"
                      >
                        {{ character.name }}
                        <small v-if="character.npcId" class="badge badge-dark">
                          {{
                          character.npcId
                          }}
                        </small>
                      </a>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <h2>Personnages disponibles</h2>
                    <div v-if="availableCharacters.length">
                      <a
                        v-for="character in availableCharacters"
                        v-bind:key="character.id"
                        class="btn btn-sm mb-2 mr-2"
                        :class="{
                          'btn-secondary': character.type == 'NPC',
                          'btn-primary': character.type != 'NPC',
                        }"
                        @click="addCharacterToEncounter(character.id)"
                      >{{ character.name }}, {{ character.type }}</a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12 my-5">
                <h2>Roll</h2>
                <a
                  @click="executeRolls(attribute)"
                  v-for="attribute in attributes"
                  v-bind:key="attribute"
                  class="btn btn-danger btn-sm mb-2 mr-2"
                >{{ attribute }}</a>
              </div>
              <div class="col-12">
                <table class="table table-stripped" v-if="round.length">
                  <thead>
                    <tr class="d-flex">
                      <td class="col-2">Name</td>
                      <td class="col-2">Dice</td>
                      <td class="col-2">Value</td>
                      <td class="col-6">Result</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="d-flex" v-for="(step, index) in round" v-bind:key="index">
                      <td class="col-2">
                        {{ characters.find((item) => item.id == step.characterId).name }}
                        <small
                          v-if="step.npcId"
                          class="badge badge-dark"
                        >{{ step.npcId }}</small>
                      </td>
                      <td class="col-2">{{ step.attribute }}</td>
                      <td class="col-2">{{ step.valueDice }}</td>
                      <td class="col-6">
                        <small>
                          <span v-for="(roll, index) in step.rolls.dices" v-bind:key="index">
                            <span
                              :class="{
                                'text-striked': roll.isRollValid == false,
                                'font-weight-bold': roll.isRollWild == true,
                                'text-danger': roll.isRollCritFail == true,
                                'text-success': roll.isRollCritWin == true,
                              }"
                            >{{ roll.result }}</span>
                            <!-- eslint-disable -->
                            <span
                              v-if="roll.isRollCritWin"
                              class="ml-1"
                            >+ ({{ step.rolls.wildRolls.join(' + ') }})</span>
                            <!-- eslint-enable -->

                            <span v-if="index + 1 != step.rolls.dices.length" class="mx-1">+</span>
                          </span>
                          =
                          <span
                            class="font-weight-bold"
                          >{{ step.rolls.score }}</span>
                        </small>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
import attributes from '../data/attributes.json';

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
      encounter: {
        name: '',
        characters: [],
      },
      round: [],
      NPCIndexes: 0,
      attributes,
    };
  },
  computed: {
    ...mapState(['characters']),
    availableCharacters() {
      return this.characters.filter(
        (el) => !this.encounter.characters.includes(el.id) || el.type === 'NPC',
      );
    },
    availablePlayers() {
      return this.encounter.characters.map((el) => {
        const characterId = el.id || el;
        const character = this.characters.find((item) => item.id === characterId);
        return {
          id: characterId,
          name: character.name,
          attributes: character.attributes,
          npcId: el.npcId || '',
          type: character.type,
        };
      });
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
            this.encounter = querySnapshot.data();
          }
        });
    },
    addCharacterToEncounter(characterId) {
      if (this.characters.find((el) => characterId === el.id).type === 'NPC') {
        this.encounter.characters.push({
          id: characterId,
          npcId: (this.NPCIndexes += 1),
        });
      } else {
        this.encounter.characters.push(characterId);
      }
    },
    removeCharacterToEncounter(index) {
      this.encounter.characters.splice(index, 1);
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
    executeRolls(attribute) {
      this.round = [];
      this.availablePlayers.forEach((characterToCompute) => {
        const valueDice = characterToCompute.attributes
          ? characterToCompute.attributes[attribute] || '2d'
          : '2d';
        this.round.push({
          attribute,
          valueDice,
          characterId: characterToCompute.id,
          npcId: characterToCompute.npcId,
          rolls: this.rollDices(valueDice),
        });
      });
      this.round.sort((a, b) => b.rolls.score - a.rolls.score);
    },
  },
};
</script>
