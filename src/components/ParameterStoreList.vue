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

        <div class="container parameter-store-list">
            <b-table :data="list">

                <template slot-scope="props">
                    <b-table-column field="Name" label="Name" sortable>
                        <div style="width: 400px" class="ellipsis" :title="props.row.Name">{{ props.row.Name }}</div>
                    </b-table-column>

                    <b-table-column field="Type" label="Type" sortable>
                        {{ props.row.Type }}
                    </b-table-column>

                    <b-table-column field="Value" label="Value" sortable>
                        <div style="width: 400px" class="ellipsis" :title="props.row.Value">{{ props.row.Value }}</div>
                    </b-table-column>

                    <b-table-column field="Date" label="Date" sortable centered>
                    <span class="tag is-success" :title="props.row.LastModifiedDate">
                        {{ new Date(props.row.LastModifiedDate).toLocaleDateString() }}
                    </span>
                    </b-table-column>

                </template>
            </b-table>
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
                loading: false
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

                this.list = [];

                this.fetchAllParameters(this.list)
                    .then(() => {
                        this.loading = false;
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

                    results.push(...tempList);

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

    .parameter-store-list {
        font-size: 14px;
    }

    .ellipsis {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
</style>
