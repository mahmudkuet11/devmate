<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 col-md-offset-3 mb-20">
        <button class="btn btn-primary btn-block" @click="install()">Install Nginx</button>
      </div>
      <div class="col-md-12 mb-20" v-show="output">
        <pre v-text="output"></pre>
      </div>
      <div class="col-md-12">
        <button class="btn btn-default" @click="back()">Back</button>
      </div>

      <vue-element-loading :active="loading" spinner="bar-fade-scale"/>

    </div>
  </div>
</template>

<script>
  import Command from '../support/Command';
  import Password from '../support/Password';
  import Swal from 'sweetalert2';
  import Spinner from '../mixin/Spinner';
  import VueElementLoading from 'vue-element-loading';
  export default {
      components: {
          VueElementLoading
      },
      mixins: [Spinner],
      data(){
          return {
              output: '',
              loading: false,
          };
      },
      methods: {
          async install(){
              this.output = '';
              let password = null;
              try {
                  password = await Password.ask();
              }catch (e) {
                  console.log('password is not provided');
                  return;
              }

              try{
                  await Command.setPassword(password);
              }catch (e) {
                  Swal.fire('Oops', 'Password is incorrect', 'error');
                  return;
              }

              try{
                  this.start('loading');
                  this.output += await Command.run('sudo apt install nginx -y');
                  this.output += await Command.run('sudo service nginx restart');
                  Swal.fire('Success', 'Nginx is installed successfully!', 'success');
              }catch (e) {
                  Swal.fire('Oops', 'Something went wrong!');
              }finally {
                  this.stop('loading');
              }
          },
          back(){
              this.$router.back();
          }
      }
  }
</script>

<style scoped>
  .mb-20{
    margin-bottom: 20px;
  }
  pre{
    padding: 10px;
    background: #000000;
    color: #ffffff;
  }
</style>