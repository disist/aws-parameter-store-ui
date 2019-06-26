<template>
    <div>
        <div class="parameter-modal card">

            <section>
                <b-field label="Name">
                    <span>{{ itemForChange.Name }}</span>
                </b-field>

                <b-field label="Value">
                    <b-input type="textarea" v-model="itemForChange.Value" placeholder="Value"></b-input>
                </b-field>

                <b-field label="LastModifiedDate">
                    <span>{{ itemForChange.LastModifiedDate }}</span>
                </b-field>

                <b-field label="History:">
                    <b-table :data="parameterHistory" :striped=true class="parameter-modal__history-table">

                        <template slot-scope="props">
                            <b-table-column field="Version" label="Version" width="40" numeric sortable>
                                {{ props.row.Version }}
                            </b-table-column>

                            <b-table-column field="Value" label="Value" sortable>
                                <div style="max-width: 400px" class="ellipsis" :title="props.row.Value">{{
                                    props.row.Value }}
                                </div>
                            </b-table-column>

                            <b-table-column field="LastModifiedUser" label="LastModifiedUser" sortable>
                                {{ props.row.LastModifiedUser }}
                            </b-table-column>

                            <b-table-column field="Date" label="LastModifiedDate" sortable>
                                <span class="tag is-success">
                                    {{ new Date(props.row.LastModifiedDate).toLocaleDateString() }}
                                </span>
                            </b-table-column>

                        </template>
                    </b-table>
                </b-field>

            </section>
            <div class="parameter-modal__buttons buttons">
                <b-button @click="onSave()" type="is-success">Save</b-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['item', 'parameterHistory', 'ssmClient'],
        data: function () {
            return {
                itemForChange: null
            }
        },
        created: function () {
            this.itemForChange = Object.assign({}, this.item);
        },
        methods: {
            onSave() {
                if (this.item.Value !== this.itemForChange.Value) {
                    const requestBody = {
                        Name: this.itemForChange.Name,
                        Description: this.itemForChange.Description,
                        Value: this.itemForChange.Value,
                        Type: this.itemForChange.Type,
                        KeyId: this.itemForChange.KeyId,
                        Overwrite: true,
                        Tags: this.itemForChange.Tags,
                        Tier: this.itemForChange.Tier,
                        Policies: this.itemForChange.Policies
                    };

                    this.ssmClient.putParameter(requestBody)
                        .promise()
                        .then(() => {
                            this.$toast.open({
                                message: 'Value has been changed',
                                type: 'is-success'
                            });
                            this.$emit('close');
                        })
                        .catch((e) => {
                            console.log(e);
                            this.$toast.open({
                                message: `Something's not good`,
                                type: 'is-danger'
                            });
                        });
                } else {
                    this.$toast.open({
                        message: `New value not specified`,
                        type: 'is-danger'
                    });
                }
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .parameter-modal {
        width: 80vw;
        height: 80vh;

        padding: 20px;

        overflow-y: scroll;
    }

    .parameter-modal__buttons {
        position: absolute;
        top: 20px;
        right: 20px;
    }

    .parameter-modal__history-table {
        overflow-y: scroll;
        height: 30vh;
    }

</style>
