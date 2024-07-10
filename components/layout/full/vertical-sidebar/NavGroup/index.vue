<script setup>
const props = defineProps({ item: Object });
</script>

<template>
    <v-list-subheader color="primary" class="smallCap text-uppercase text-subtitle-2 mt-5 font-weight-bold">{{ props.item.header}}</v-list-subheader>
</template>
