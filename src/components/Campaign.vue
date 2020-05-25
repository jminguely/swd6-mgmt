<template>
  <div id="campaign">
    <section>
      <div class="profile">
        <div class="edit-campaign">
          <p>edit a campaign</p>
          <form>
            <input v-model.trim="campaign.name" type="text" id="campaignName" />
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
const fb = require('../firebase');

export default {
  name: 'Campaign',
  props: {
    id: {
      type: String,
      default: 'asdf',
    },
  },
  data() {
    return {
      campaign: {},
    };
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
  },
};
</script>
