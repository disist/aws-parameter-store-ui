<template>
    <div>
        <div class="profile-modal card">

            <form @submit.prevent="onSave()">
                <section>
                    <b-field label="Name">
                        <b-input autofocus v-model="name" required placeholder="Name"></b-input>
                    </b-field>

                </section>
                <div class="profile-modal__buttons buttons">
                    <b-button :disabled="!name" @click="onSave()" type="is-success">Save</b-button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['item'],
        data: function () {
            return {
                name: '',
            }
        },
        created: function () {
            if (this.item) {
                this.name = this.item.name;
            }
        },
        methods: {
            onSave() {

                if (!this.name) {
                    return;
                }

                let profiles = JSON.parse(localStorage.getItem('profiles'));

                if (!profiles) {
                    profiles = [];
                }

                const newItem = { name: this.name };

                profiles.push(newItem);

                localStorage.setItem('profiles', JSON.stringify(profiles));
                localStorage.setItem('activeProfile', profiles.indexOf(newItem));

                this.$toast.open({
                    message: 'Profile has been created',
                    type: 'is-success'
                });
                this.$emit('profile:created');
                this.$emit('close');
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .profile-modal {
        width: 400px;
        height: 170px;

        padding: 20px;
    }

    .profile-modal__buttons {
        margin-top: 20px;
    }

</style>
