(function(e){function t(t){for(var a,i,c=t[0],l=t[1],o=t[2],d=0,f=[];d<c.length;d++)i=c[d],r[i]&&f.push(r[i][0]),r[i]=0;for(a in l)Object.prototype.hasOwnProperty.call(l,a)&&(e[a]=l[a]);u&&u(t);while(f.length)f.shift()();return n.push.apply(n,o||[]),s()}function s(){for(var e,t=0;t<n.length;t++){for(var s=n[t],a=!0,c=1;c<s.length;c++){var l=s[c];0!==r[l]&&(a=!1)}a&&(n.splice(t--,1),e=i(i.s=s[0]))}return e}var a={},r={app:0},n=[];function i(t){if(a[t])return a[t].exports;var s=a[t]={i:t,l:!1,exports:{}};return e[t].call(s.exports,s,s.exports,i),s.l=!0,s.exports}i.m=e,i.c=a,i.d=function(e,t,s){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(i.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)i.d(s,a,function(t){return e[t]}.bind(null,a));return s},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/aws-parameter-store-ui/";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],l=c.push.bind(c);c.push=t,c=c.slice();for(var o=0;o<c.length;o++)t(c[o]);var u=l;n.push([1,"chunk-vendors"]),s()})({0:function(e,t){},"034f":function(e,t,s){"use strict";var a=s("64a9"),r=s.n(a);r.a},"06f9":function(e,t,s){},1:function(e,t,s){e.exports=s("56d7")},"418b":function(e,t,s){"use strict";var a=s("06f9"),r=s.n(a);r.a},"56d7":function(e,t,s){"use strict";s.r(t);s("cadf"),s("551c"),s("f751"),s("097d");var a=s("2b0e"),r=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{attrs:{id:"app"}},[s("ParameterStoreList")],1)},n=[],i=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("div",{staticClass:"controls"},[s("div",{staticClass:"controls__card card"},[s("section",[s("b-field",{attrs:{label:"accessKeyId"}},[s("b-input",{attrs:{placeholder:"accessKeyId"},model:{value:e.accessKeyId,callback:function(t){e.accessKeyId=t},expression:"accessKeyId"}})],1),s("b-field",{attrs:{label:"secretAccessKey"}},[s("b-input",{attrs:{type:"password",placeholder:"secretAccessKey","password-reveal":""},model:{value:e.secretAccessKey,callback:function(t){e.secretAccessKey=t},expression:"secretAccessKey"}})],1),s("b-field",{attrs:{label:"region"}},[s("b-input",{attrs:{placeholder:"region"},model:{value:e.region,callback:function(t){e.region=t},expression:"region"}})],1)],1),s("div",{staticClass:"buttons controls__login-buttons"},[s("b-button",{attrs:{disabled:e.ssm},on:{click:function(t){return e.sign()}}},[e._v("Sign")])],1)]),s("div",{staticClass:"controls__card card"},[s("b-field",[s("b-button",{attrs:{type:"is-primary",disabled:!e.ssm,loading:e.loading},on:{click:function(t){return e.getAllParameters()}}},[e._v("Get all\n                    parameters\n                ")]),s("span",{staticClass:"controls__path-label"},[e._v("By path: ")]),s("b-input",{attrs:{disabled:this.loading,placeholder:"by path"},model:{value:e.path,callback:function(t){e.path=t},expression:"path"}})],1),s("hr"),s("b-field",{attrs:{label:"Local Filter, Search by:"}},[s("b-select",{attrs:{placeholder:"Select a Field"},model:{value:e.searchField,callback:function(t){e.searchField=t},expression:"searchField"}},e._l(["Name","Value"],function(t){return s("option",{key:t,domProps:{value:t}},[e._v("\n                        "+e._s(t)+"\n                    ")])}),0)],1),s("b-field",[s("b-taginput",{attrs:{placeholder:"Add search text"},model:{value:e.searchTexts,callback:function(t){e.searchTexts=t},expression:"searchTexts"}})],1)],1)]),s("div",{staticClass:"container parameter-store-list"},[s("b-table",{attrs:{data:e.list,striped:!0,hoverable:!0},on:{click:function(t){return e.onItemClick(t)}},scopedSlots:e._u([{key:"default",fn:function(t){return[s("b-table-column",{attrs:{field:"Name",label:"Name",sortable:""}},[s("div",{staticClass:"ellipsis",staticStyle:{width:"400px"}},[e._v(e._s(t.row.Name))])]),s("b-table-column",{attrs:{field:"Type",label:"Type",sortable:""}},[e._v("\n                    "+e._s(t.row.Type)+"\n                ")]),s("b-table-column",{attrs:{field:"Value",label:"Value",sortable:""}},[s("div",{staticClass:"ellipsis",staticStyle:{width:"400px"}},[e._v(e._s(t.row.Value))])]),s("b-table-column",{attrs:{field:"Date",label:"LastModifiedDate",sortable:"",centered:""}},[s("span",{staticClass:"tag is-success"},[e._v("\n                    "+e._s(new Date(t.row.LastModifiedDate).toLocaleDateString())+"\n                ")])])]}}])})],1)])},c=[],l=s("75fc"),o=(s("6762"),s("2fdb"),s("9954")),u=s.n(o),d={name:"ParameterStoreList",data:function(){return{accessKeyId:"",secretAccessKey:"",region:"",ssm:null,list:[],originalList:[],loading:!1,path:"/",searchField:"Name",searchTexts:[]}},watch:{searchTexts:function(e){var t=this;this.searchField&&e&&e.length?this.list=this.originalList.filter(function(s){return e.some(function(e){return s[t.searchField].toLowerCase().includes(e.toLowerCase())})}):this.list=this.originalList}},created:function(){this.accessKeyId=localStorage.getItem("accessKeyId"),this.secretAccessKey=localStorage.getItem("secretAccessKey"),this.region=localStorage.getItem("region")},methods:{sign:function(){this.ssm=new u.a({accessKeyId:this.accessKeyId,secretAccessKey:this.secretAccessKey,region:this.region}),localStorage.setItem("accessKeyId",this.accessKeyId),localStorage.setItem("secretAccessKey",this.secretAccessKey),localStorage.setItem("region",this.region)},getAllParameters:function(){var e=this;this.loading=!0,this.searchTexts&&(this.searchTexts=[]),this.list=this.originalList=[],this.fetchAllParameters(this.originalList).then(function(){e.loading=!1})},fetchAllParameters:function(e,t){var s=this,a={Path:this.path,Recursive:!0};return t&&(a.NextToken=t),this.ssm.getParametersByPath(a).promise().then(function(t){var a=t.NextToken,r=t.Parameters.map(function(e){return e.LastModifiedDate=e.LastModifiedDate.toGMTString(),e});return e.push.apply(e,Object(l["a"])(r)),a?s.fetchAllParameters(e,a):Promise.resolve(e)})},onItemClick:function(e){console.log(e)}}},f=d,p=(s("418b"),s("2877")),h=Object(p["a"])(f,i,c,!1,null,"092fe413",null),b=h.exports,m={name:"app",components:{ParameterStoreList:b}},g=m,y=(s("034f"),Object(p["a"])(g,r,n,!1,null,null,null)),v=y.exports,_=s("409f"),x=s.n(_),w=s("3e88"),K=s.n(w),S=s("15f3"),I=s.n(S),P=s("21ce"),k=s.n(P),A=s("1559"),L=s.n(A),T=s("d54d"),C=s.n(T);s("5abe");a["a"].config.productionTip=!1,a["a"].use(x.a),a["a"].use(K.a),a["a"].use(I.a),a["a"].use(k.a),a["a"].use(L.a),a["a"].use(C.a),new a["a"]({render:function(e){return e(v)}}).$mount("#app")},"64a9":function(e,t,s){}});