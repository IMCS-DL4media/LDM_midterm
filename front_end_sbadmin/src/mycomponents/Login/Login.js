import { mymixin } from '../mixins/mixins.js'

console.log("in login")

// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";
// import router from "../../router.js";

import Vue from "vue";
import VueResource from 'vue-resource';
Vue.use(VueResource);

export default {
	name: "Login",
	// data: {
	// 	showModal: false,
	// },
	props: ['user_id'],
	components: {},
	mixins:[mymixin],
	data:function(){
		return {
			user_name:"",
			password:"",
			isLoading:false,
			error:"",

			currentUser : 1,
			
			projects : []
		}
	},

	created(){
    
		//console.log( process );
		//console.log( process.env );
		//console.log( process.env.VUE_APP_SERVER_URL );
		//console.log("in created this", this)


		//fetch( 'http://' + process.env.VUE_APP_SERVER_URL + '/get_projects?user=1')
		//SERVER_URL()
		//fetch( 'http://localhost:5000/get_projects?user=1')
		this.loadProjects();
	},

	methods: {
		async login(){
			this.error = "";
			console.log("login method");
			this.isLoading = true;

			const actionPayload = {
				email: this.user_name,
				password: this.password,
			};

			try {
				
				await this.$store.dispatch('login', actionPayload);
				
				const redirectUrl = '/' + (this.$route.query.redirect || '');
				this.$router.replace(redirectUrl);
			} catch (err) {
				this.error = err.message || 'Failed to authenticate, try later.';
			}

			this.isLoading = false;
		},

		loadProjects(){
			console.log(mymixin.SERVER_URL);
			fetch( this.SERVER_URL() + 'get_projects?user=1')
				.then(function(response) {
				if (!response.ok) {
					throw Error(response.statusText);
				}
				return response;
			})
			.then(response=>response.json())
			.then(json => {
					console.log("in json ", json)
					this.projects = json.projects
			}).catch(function(error) {
				console.log(error);
			});
		},

		// createNewProjectClicked() {
			// console.log("in create new project", $("#myModal").length)

			// $("#myModal").modal("show");


			// var user_id_prm;
			// if (this.user_id == undefined) {
			//   //default user id
			//   user_id_prm = "1"
			// } else{
			//   user_id_prm = this.user_id
			// }
			// router.push("/addproject/" + user_id_prm )
		// }
		createNewProjectClicked:function() {
			// console.log("in create new project", $("#myModal").length)
			// console.log($("#project_name_id").value);
			// console.log($("#training_file_input_id").value);
			// console.log($("#training_file_input").value);

			//e.preventDefault();

			// console.log( document.getElementById("project_name_id").value)
			// console.log( document.getElementById("training_file_input_id").value)
			
			// console.log(this.$refs);
			// console.log(this.$refs.fileInputRef);

			$('#alerts_success').hide();
			$('#alerts_fail').hide();

			//let fileToUpload = this.$refs.fileInputRef.files[0];
			let formData = new FormData();
			
			formData.append('project_name', document.getElementById("project_name_id").value);
			formData.append('project_description', document.getElementById("project_description_id").value);
			
			//formData.append('zip_file', fileToUpload);
			
			
			// console.log(formData);
			// for (var key of formData.entries()) {
			// 	console.log(key[0] + ', ' + key[1]);
			// }

			this.$http.post(  this.SERVER_URL() + "create_new_project", formData)
				.then(response => {					
					console.log(response.body)				
					$('#alerts_success').show();
					//list of projects has to be relaoded, because we just created a new one
					this.loadProjects();
				},
				response => {						
					console.log(response.body)				
					$('#alerts_fail').show();
				})
			
			return;

			// var user_id_prm;
			// if (this.user_id == undefined) {
			//   //default user id
			//   user_id_prm = "1"
			// } else{
			//   user_id_prm = this.user_id
			// }
			// router.push("/addproject/" + user_id_prm )
		}		
	}
};
