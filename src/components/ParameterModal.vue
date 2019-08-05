<template>
    <div>
        <div class="parameter-modal card">
            <h1 class="title">
                    [Parameter] {{ itemForChange.Name }}
            </h1>
            <i><h4 class="subtitle is-6">Last modified on {{ itemForChange.LastModifiedDate.toLocaleString()}} UTC</h4></i>

            <section class="parameter-modal__section">
                <b-field label="Value">
                    <b-input type="textarea" v-model="itemForChange.Value" placeholder="Value"></b-input>
                </b-field>

                <div class="parameter-modal__buttons buttons">
                    <b-button @click="onSave()" type="is-success">Save</b-button>

                    <b-button @click="onDelete()" type="is-danger">Delete</b-button>
                </div>
            </section>


            <section class="parameter-modal__section">
                <div class="container">
                    <h1 class="title">Previous Versions</h1>
                    <b-table :data="parameterHistory" :striped=true :narrowed="true">

                    <template slot-scope="props">
                        <b-table-column field="Version" label="#" width="40" numeric sortable>
                            {{ props.row.Version }}
                        </b-table-column>

                        <b-table-column field="Value" label="Value" sortable>
                            <div style="max-width: 400px" class="ellipsis" :title="props.row.Value">{{
                                props.row.Value }}
                            </div>
                        </b-table-column>

                        <b-table-column field="LastModifiedUser" label="Modifier" sortable>
                            {{ props.row.LastModifiedUser }}
                        </b-table-column>

                        <b-table-column field="Date" label="Modified At" sortable>
                            <span class="tag is-success">
                                {{ new Date(props.row.LastModifiedDate).toLocaleDateString() }}
                            </span>
                        </b-table-column>

                    </template>
                </b-table>
                </div>
            </section>
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
                            this.$emit('parameter:updated', this.itemForChange);
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
            },
            onDelete() {
                this.$dialog.confirm({
                    title: 'Deleting parameter',
                    message: 'Are you sure you want to <b>delete</b> your parameter? This action cannot be undone.',
                    confirmText: 'Delete Parameter',
                    type: 'is-danger',
                    onConfirm: () => {
                        this.ssmClient.deleteParameter({ Name: this.item.Name })
                            .promise()
                            .then(() => {
                                this.$toast.open('Parameter deleted!');
                                this.$emit('parameter:deleted', this.item);
                                this.$emit('close');
                            });
                    }
                })
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .parameter-modal {
        width: 80vw;
        height: 85vh;

        padding: 20px;

        overflow-y: scroll;
    }

    .parameter-modal__buttons {
        display: flex;
        justify-content: space-between;
    }

    .parameter-modal__section {
        padding: 10px 15px;
    }

</style>
