<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-6 col-md-offset-3">
                <div class="panel panel-default">
                    <div class="panel-heading">Settings</div>
                    <div class="panel-body">

                        <form class="form-horizontal">
                            <fieldset>

                                <div class="form-group">
                                    <label class="col-md-4 control-label">Server Name</label>
                                    <div class="col-md-8">
                                        <tags-input
                                                v-model="server_name"
                                                :tags="server_names"
                                                :placeholder="'Enter domain names(s)...'"
                                                :allow-edit-tags="true"
                                                :max-tags="10"
                                                :maxlength="50"
                                                :separators="[';', ',']"
                                                @tags-changed="updateServerNames"
                                        ></tags-input>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="col-md-4 control-label">Root</label>
                                    <div class="col-md-8">
                                        <input type="text" v-model="root" class="form-control" placeholder="Enter root...">
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label class="col-md-4 control-label">PHP Version</label>
                                    <div class="col-md-8">
                                        <input type="text" v-model="php_version" class="form-control" placeholder="ie: 7.2">
                                    </div>
                                </div>

                            </fieldset>
                        </form>

                        <vue-element-loading :active="loading" spinner="bar-fade-scale"/>

                    </div>

                    <div class="panel-footer">
                        <div class="pull-left">
                            <button class="btn btn-default" @click="back()">Back</button>
                        </div>
                        <div class="pull-right">
                            <button class="btn btn-primary" @click="submit()">Submit</button>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import VueTagsInput from '@johmun/vue-tags-input';
    import _ from 'lodash';
    import Password from '../support/Password';
    import Command from '../support/Command';
    import Swal from 'sweetalert2';
    import Spinner from '../mixin/Spinner';
    import VueElementLoading from 'vue-element-loading';

    export default {
        components: {
            tagsInput: VueTagsInput,
            VueElementLoading,
        },
        mixins: [Spinner],
        data(){
            return {
                server_name: '',
                server_names: [],
                root: '',
                php_version: '',
                loading: false,
            };
        },
        methods: {
            updateServerNames(tags){
                this.server_names = tags;
            },
            back(){
                this.$router.back();
            },
            async submit(){
                let server_names = _.map(this.server_names, server_name => {
                    return server_name.text.trim();
                });
                let vhost_stub = file.sync(path.join(base_path(), 'src/stub/nginx_vhost/vhost.stub')).toString();
                let nginx_vhost_config = Mustache.render(vhost_stub, {
                    root: this.root.trim(),
                    server_names: server_names.join(' '),
                    php_version: this.php_version.trim()
                });

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
                    console.log('password is incorrect!');
                    return;
                }

                try{
                    this.start('loading');
                    const writeFile = util.promisify(fs.writeFile);
                    const file_name = server_names.join('_');
                    const file_path = path.join(remote.app.getPath('temp'), `/${file_name}`);
                    await writeFile(file_path, nginx_vhost_config);
                    await Command.run(`sudo cp ${file_path} /etc/nginx/sites-available/${file_name}`);
                    await Command.run(`sudo rm -rf ${file_path}`);
                    await Command.run(`sudo ln -s /etc/nginx/sites-available/${file_name} /etc/nginx/sites-enabled/`);
                    const hosts_path = path.join(remote.app.getPath('temp'), `./hosts`);
                    await Command.run(`sudo cp /etc/hosts ${hosts_path}`);
                    await Command.run(`sudo chmod 777 ${hosts_path}`);
                    let hosts = _.map(this.server_names, server_name => {
                        server_name = server_name.text.trim();
                        return `127.0.0.1 ${server_name}`;
                    });
                    hosts = '\n' + hosts.join('\n') + '\n';
                    fs.appendFileSync(hosts_path, hosts);

                    await Command.run(`sudo cp ${hosts_path} /etc/hosts`);
                    await Command.run(`sudo rm -rf ${hosts_path}`);
                    await Command.run('sudo chmod 644 /etc/hosts');
                    await Command.run('sudo service nginx restart');

                    this.stop('loading');

                    Swal.fire('Success', 'Virtual host is created successfully', 'success');

                }catch (e) {
                    console.log(e);
                    this.stop('loading');
                    this.showError(e.message);
                }

            },
            showError(msg = 'Something went wrong!'){
                Swal.fire('Oops', msg, 'error');
            }
        }
    }
</script>