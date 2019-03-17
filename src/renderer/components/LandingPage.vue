<template>
  <div id="wrapper">
    <main>
        <h1 @click="open('https://github.com/yansenlei/electron-asar-hot-updater')">Electron-asar-hot-updater Demo</h1>
        <p class="title">
          Old version
        </p>
    </main>
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'

  export default {
    name: 'landing-page',
    components: { SystemInformation },
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      }
    }
  }
</script>

<style>

</style>
