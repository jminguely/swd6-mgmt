<template>
  <div id="campaigns">
    <section>
      <div class="profile">
        <h5>{{ userProfile.name }}</h5>
        <div class="create-campaign">
          <p>create a campaign</p>
          <form @submit.prevent>
            <input v-model.trim="campaign.name" type="text" id="campaignName" />
            <button @click="createCampaign" :disabled="campaign.name == ''" class="button">
              campaign
            </button>
          </form>
        </div>
      </div>

      <ul v-if="campaigns.length">
        <li v-for="campaign in campaigns" v-bind:key="campaign.id" class="campaign">
          {{ campaign.name }}
        </li>
      </ul>
      <div v-else>
        <p class="no-results">There are currently no campaigns</p>
      </div>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';

const fb = require('../firebase');

export default {
  data() {
    return {
      campaign: {
        name: '',
      },
    };
  },
  computed: {
    ...mapState(['userProfile', 'currentUser', 'campaigns']),
  },
  methods: {
    createCampaign() {
      fb.campaignsCollection
        .add({
          createdOn: new Date(),
          name: this.campaign.name,
          userId: this.currentUser.uid,
        })
        .then(() => {
          this.post.content = '';
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>
