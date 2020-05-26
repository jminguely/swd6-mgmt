<template>
  <input :value="value" type="text" :id="id" v-on:change="$emit('my-event')" />
</template>
<script>
export default {
  name: 'm-form-group-icon-select',
  data() {
    return {
      value: '2d',
    };
  },
  props: {
    id: {
      type: String,
      default: '',
    },
  },
};
</script>
