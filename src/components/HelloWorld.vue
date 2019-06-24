<template>
  <div>
      <section class="login-form">
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
    <div>
        <b-button :disabled="ssm" @click="sign()">Sign</b-button>
        <b-button type="is-primary" :disabled="!ssm" :loading="loading" @click="getParameters()">Get</b-button>
    </div>

    <div class="container">
        <b-table :data="list" :columns="columns"></b-table>
    </div>
  </div>
</template>

<script>
import SSM from 'aws-sdk/clients/ssm';

export default {
  name: 'HelloWorld',
  data: function() {
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
                    label: 'Name'
                },
                {
                    field: 'Type',
                    label: 'Type'
                },
                {
                    field: 'Value',
                    label: 'Value'
                },
                {
                    field: 'LastModifiedDate',
                    label: 'Date',
                    centered: true
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
      getParameters() {
          this.loading = true;

          this.ssm.getParametersByPath({ Path: '/' }).promise().then((res) => {
              console.log(res.Parameters);

              this.list = res.Parameters;
              this.loading = false;
          });
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.login-form {
    width: 40%;
    margin: auto;
}
</style>
