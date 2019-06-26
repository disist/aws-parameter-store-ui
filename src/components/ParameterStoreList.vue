<template>
    <div>
        <div class="controls">
            <div class="controls__card card">
                <section>
                    <b-field label="accessKeyId">
                        <b-input v-model="accessKeyId" placeholder="accessKeyId"></b-input>
                    </b-field>
                    <b-field label="secretAccessKey">
                        <b-input type="password" v-model="secretAccessKey" placeholder="secretAccessKey" password-reveal></b-input>
                    </b-field>
                    <b-field label="region">
                        <b-input v-model="region" placeholder="region"></b-input>
                    </b-field>
                </section>
                <div class="buttons controls__login-buttons">
                    <b-button :disabled="ssm" @click="sign()">Sign</b-button>
                </div>
            </div>

            <div class="controls__card card">

                <b-field>
                    <b-button type="is-primary" :disabled="!ssm" :loading="loading" @click="getAllParameters()">Get all
                        parameters
                    </b-button>

                    <span class="controls__path-label">By path: </span>

                    <b-input v-model="path" :disabled="this.loading" placeholder="by path"></b-input>
                </b-field>

                <hr>

                <b-field label="Local Filter, Search by:">
                    <b-select v-model="searchField" :disabled="!ssm" placeholder="Select a Field">
                        <option
                                v-for="option in ['Name', 'Value']"
                                :value="option"
                                :key="option">
                            {{ option }}
                        </option>
                    </b-select>
                </b-field>

                <b-field>
                    <b-input v-model="searchText" :disabled="!ssm" placeholder="Search value" rounded></b-input>
                </b-field>

            </div>
        </div>

        <div class="container parameter-store-list">
            <b-table :data="list" :striped=true :hoverable=true @click="onItemClick($event)">

                <template slot-scope="props">
                    <b-table-column field="Name" label="Name" sortable>
                        <div style="width: 400px" class="ellipsis">{{ props.row.Name }}</div>
                    </b-table-column>

                    <b-table-column field="Type" label="Type" sortable>
                        {{ props.row.Type }}
                    </b-table-column>

                    <b-table-column field="Value" label="Value" sortable>
                        <div style="width: 400px" class="ellipsis">{{ props.row.Value }}</div>
                    </b-table-column>

                    <b-table-column field="Date" label="LastModifiedDate" sortable centered>
                    <span class="tag is-success">
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
                originalList: [],
                loading: false,
                path: '/',
                searchField: 'Name',
                searchText: ''
            }
        },
        watch: {
            searchText: function (newValue) {
                if (!this.searchField || !newValue || newValue.length < 2) {
                    this.list = this.originalList;
                    return;
                }

                this.list = this.originalList.filter((parameter) => {
                    return parameter[this.searchField].toLowerCase().includes(this.searchText.toLowerCase());
                });
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

                if (this.searchText !== '') {
                    this.searchText = '';
                }

                this.list = this.originalList = [];

                this.fetchAllParameters(this.originalList)
                    .then(() => {
                        this.loading = false;
                    });
            },
            fetchAllParameters(results, nextToken) {
                const options = {
                    Path: this.path,
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
            },
            onItemClick(item) {
                console.log(item);
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .controls {
        display: flex;
        justify-content: space-evenly;

        margin-bottom: 20px;
    }

    .controls__card {
        width: 500px;
        padding: 20px;
    }

    .controls__path-label {
        line-height: 40px;
    }

    .controls__login-buttons {
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
