<template>
    <div>
        <div class="controls">

            <b-collapse
                    aria-id="contentIdForLoginCard"
                    class="panel"
                    :open.sync="isOpenLoginCard">
                <div
                        slot="trigger"
                        class="panel-heading controls__card-title"
                        role="button"
                        aria-controls="contentIdForLoginCard">
                    <strong>Login Profile: {{activeProfileName}}</strong>
                </div>
                <div class="controls__card card">
                    <section>
                        <b-dropdown aria-role="list">
                            <button class="button is-primary" slot="trigger">
                                <span>Profiles</span>
                            </button>

                            <b-dropdown-item
                                    aria-role="listitem"
                                    v-for="(profile, index) in profiles"
                                    v-bind:key="profile.name"
                                    @click="onProfileClick(index)">
                                {{profile.name}}</b-dropdown-item>
                            <hr>
                            <b-dropdown-item aria-role="listitem" @click="createNewProfile()">Create New</b-dropdown-item>
                        </b-dropdown>

                        <b-field label="accessKeyId">
                            <b-input v-model="accessKeyId" placeholder="accessKeyId"></b-input>
                        </b-field>
                        <b-field label="secretAccessKey">
                            <b-input type="password" v-model="secretAccessKey" placeholder="secretAccessKey"
                                     password-reveal></b-input>
                        </b-field>
                        <b-field label="region">
                            <b-input v-model="region" placeholder="region"></b-input>
                        </b-field>
                    </section>
                    <div class="buttons controls__login-buttons">
                        <b-button :disabled="ssm" @click="sign()">Sign</b-button>
                    </div>
                </div>
            </b-collapse>

            <b-collapse
                    aria-id="contentIdForFiltersCard"
                    class="panel"
                    :open.sync="isOpenFiltersCard">
                <div
                        slot="trigger"
                        class="panel-heading controls__card-title"
                        role="button"
                        aria-controls="contentIdForFiltersCard">
                    <strong>Filters</strong>
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
                        <b-input v-model="searchText" @input="onSearchText" :disabled="!ssm" placeholder="Search value" rounded></b-input>
                    </b-field>

                </div>
            </b-collapse>

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
    import ParameterModal from './ParameterModal';
    import ProfileModal from './ProfileModal';
    import { debounce } from '../helpers';

    export default {
        name: 'ParameterStoreList',
        data: function () {
            return {
                isOpenLoginCard: true,
                isOpenFiltersCard: true,

                profiles: null,
                activeProfile: null,
                activeProfileName: '',

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
        created: function () {
            this.init();
        },
        methods: {
            init() {
                this.profiles = JSON.parse(localStorage.getItem('profiles'));
                const activeProfile = localStorage.getItem('activeProfile');

                if (activeProfile) {
                    this.activeProfile = +activeProfile;
                }

                if (!this.profiles) {
                    this.profiles = [{
                        name: 'Common'
                    }];

                    this.activeProfile = 0;
                }

                if (this.profiles) {
                    this._readProfile(this.activeProfile);
                }
            },
            sign() {
                this.ssm = new SSM({
                    accessKeyId: this.accessKeyId,
                    secretAccessKey: this.secretAccessKey,
                    region: this.region
                });

                this.profiles[this.activeProfile].accessKeyId = this.accessKeyId;
                this.profiles[this.activeProfile].secretAccessKey = this.secretAccessKey;
                this.profiles[this.activeProfile].region = this.region;

                this._saveProfile();

                this.isOpenLoginCard = false;
            },
            onProfileClick(index) {
                this.activeProfile = index;
                this._readProfile(this.activeProfile);

                this._saveProfile();

                this.ssm = null;
            },
            onSearchText: debounce(function(newValue) {
                if (!this.searchField || !newValue || newValue.length < 2) {
                    this.list = this.originalList;
                    return;
                }

                this.list = this.originalList.filter((parameter) => {
                    return parameter[this.searchField].toLowerCase().includes(this.searchText.toLowerCase());
                });
            }, 500),
            createNewProfile() {
                this.$modal.open({
                    parent: this,
                    component: ProfileModal,
                    hasModalCard: true,
                    props: {
                        item: null
                    },
                    events: {
                        'profile:created': this.onProfileCreated
                    }
                });
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
                const loadingComponent = this.$loading.open({isFullPage: true});

                Promise.all([
                    this.ssm.getParameter({Name: item.Name}).promise(),
                    this.ssm.getParameterHistory({Name: item.Name}).promise()
                ]).then(([parameter, parameterHistory]) => {
                    loadingComponent.close();

                    this.$modal.open({
                        parent: this,
                        component: ParameterModal,
                        hasModalCard: true,
                        props: {
                            item: parameter.Parameter,
                            parameterHistory: parameterHistory.Parameters,
                            ssmClient: this.ssm
                        }
                    });
                });
            },
            onProfileCreated() {
                this.ssm = null;

                this.init();
            },
            _readProfile(index) {
                this.accessKeyId = this.profiles[index].accessKeyId;
                this.secretAccessKey = this.profiles[index].secretAccessKey;
                this.region = this.profiles[index].region;
                this.activeProfileName = this.profiles[index].name;
            },
            _saveProfile() {
                localStorage.setItem('profiles', JSON.stringify(this.profiles));
                localStorage.setItem('activeProfile', this.activeProfile);
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

    .controls__card-title {
        width: 500px;
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
</style>
