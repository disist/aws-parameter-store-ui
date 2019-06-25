<template>
    <div>
        <div class="login-form card">
            <section>
                <b-field label="accessKeyId">
                    <b-input v-model="accessKeyId" placeholder="accessKeyId"></b-input>
                </b-field>
                <b-field label="secretAccessKey">
                    <b-input v-model="secretAccessKey" placeholder="secretAccessKey"></b-input>
                </b-field>
                <b-field label="region">
                    <b-input v-model="region" placeholder="region"></b-input>
                </b-field>
            </section>
            <div class="buttons login-form__buttons">
                <b-button :disabled="ssm" @click="sign()">Sign</b-button>
                <b-button type="is-primary" :disabled="!ssm" :loading="loading" @click="getAllParameters()">Get all
                    parameters
                </b-button>
            </div>

        </div>

        <div class="container">
            <b-table :data="list" :columns="columns"></b-table>
        </div>
    </div>
</template>

<script>
    import SSM from 'aws-sdk/clients/ssm';

    export default {
        name: 'ParameterStoreList',
        data: function () {
            return {
                accessKeyId: '',
                secretAccessKey: '',
                region: '',
                ssm: null,
                list: [],
                loading: false,
                columns: [
                    {
                        field: 'Name',
                        label: 'Name',
                        sortable: true
                    },
                    {
                        field: 'Type',
                        label: 'Type',
                        sortable: true
                    },
                    {
                        field: 'Value',
                        label: 'Value'
                    },
                    {
                        field: 'LastModifiedDate',
                        label: 'Date',
                        centered: true,
                        sortable: true
                    }
                ]
            }
        },
        created: function () {
            this.accessKeyId = localStorage.getItem('accessKeyId');
            this.secretAccessKey = localStorage.getItem('secretAccessKey');
            this.region = localStorage.getItem('region');
        },
        methods: {
            sign() {
                this.ssm = new SSM({
                    accessKeyId: this.accessKeyId,
                    secretAccessKey: this.secretAccessKey,
                    region: this.region
                });

                localStorage.setItem('accessKeyId', this.accessKeyId);
                localStorage.setItem('secretAccessKey', this.secretAccessKey);
                localStorage.setItem('region', this.region);
            },
            getAllParameters() {
                this.loading = true;

                this.fetchAllParameters([])
                    .then((results) => {
                        this.loading = false;
                        this.list = results;
                    });
            },
            fetchAllParameters(results, nextToken) {
                const options = {
                    Path: '/',
                    Recursive: true
                };

                if (nextToken) {
                    options.NextToken = nextToken;
                }

                return this.ssm.getParametersByPath(options).promise().then((res) => {
                    const next = res.NextToken;

                    const tempList = res.Parameters.map((parameter) => {
                        parameter.LastModifiedDate = parameter.LastModifiedDate.toGMTString();
                        return parameter;
                    });

                    results = results.concat(tempList);

                    if (next) {
                        return this.fetchAllParameters(results, next);
                    }

                    return Promise.resolve(results);
                });
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .login-form {
        width: 40%;
        padding: 20px;
        margin: auto auto 20px;
    }

    .login-form__buttons {
        margin-top: 20px;
    }
</style>
