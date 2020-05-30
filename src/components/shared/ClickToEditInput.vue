<template>
  <div :class="classes">
    <input
      type="text"
      v-if="edit"
      :value="valueLocal"
      @blur="valueLocal = $event.target.value; edit = false; $emit('input', valueLocal);"
      @keyup.enter="valueLocal = $event.target.value; edit = false; $emit('input', valueLocal);"
      v-focus
      class="input"
    />
    <p v-else @click="edit = true;" class="field" :class="classes">{{valueLocal}}</p>
  </div>
</template>

<style type="scss" scoped>
.field,
.input {
  color: black;
  background: none;
  width: 100%;
  display: block;
  border-radius: 0;
  padding: 0.5rem 0;
  margin: 0rem;
  height: 2.5rem;
  border: 0;
  border-bottom: 2px solid lightgray;
  outline: 0;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;
  font-size: 0.9rem;
}

.input {
  background: lightgray;
  color: black;
}

.lg {
  width: 15rem;
}

.md {
  width: 10rem;
}

.sm {
  width: 3.5rem;
}
</style>

<script>
export default {
  name: 'ClickToEditInput',
  props: ['value', 'classes'],
  data() {
    return {
      edit: false,
      valueLocal: this.value,
    };
  },
  watch: {
    value() {
      this.valueLocal = this.value;
    },
  },
  directives: {
    focus: {
      inserted(el) {
        el.focus();
      },
    },
  },
};
</script>
