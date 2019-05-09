<template>
  <div class="container-fluid">
      <div class="row">
          <div class="col-md-12">
              <input type="text" class="form-control" v-model="command" @keypress.enter="run()">
          </div>
      </div>
      <div class="row">
          <div class="col-md-12">
              <pre v-show="output" v-text="output"></pre>
          </div>
      </div>
  </div>
</template>

<script>
    export default {
        data(){
            return {
                command: '',
                output: ''
            };
        },
        methods: {
            run(){
                if(! this.command) return;
                this.output = '';
                let process = cmd.get(this.command);
                process.stdout.on('data', data => {
                    this.output += data;
                });
                this.command = '';
            }
        }
    }
</script>

<style scoped="">
    pre{
        background: #000000;
        color: #ffffff;
        padding: 10px;
        margin-top: 20px;
    }
</style>