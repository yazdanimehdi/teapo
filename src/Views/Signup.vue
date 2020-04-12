<template>
    <div style="background-color: white; height: 100%;">
        <div style="text-align: center">
            <img src="../assets/logo.png" height="200px"/>
            <div><h2 style="color: black">Create new account</h2></div>
        </div>
        <v-container>
            <v-row align="center" justify="center" dense>
                <div style="width: 50%; margin: auto; display: block;">
                    <v-card light style="width: 100%">
                        <v-card-text>
                            <v-form ref="form"
                                    v-model="valid"
                                    lazy
                            >
                            <v-text-field placeholder="Name"
                                          prepend-icon="email"
                                          :rules="nameRules"
                                          outlined
                                          shaped
                                          type="email"
                                          v-model="user.name"
                                          clearable required
                            ></v-text-field>
                            <v-text-field placeholder="Last Name"
                                          prepend-icon="email"
                                          :rules="nameRules"
                                          outlined
                                          shaped
                                          type="email"
                                          v-model="user.lastname"
                                          clearable required
                            ></v-text-field>
                                <v-text-field placeholder="Phone Number"
                                              prepend-icon="email"
                                              :rules="nameRules"
                                              outlined
                                              shaped
                                              type="email"
                                              v-model="user.lastname"
                                              clearable required
                                ></v-text-field>
                            <v-text-field placeholder="Email"
                                    prepend-icon="email"
                                    outlined shaped type="email"
                                    v-model="user.email"
                                    :rules="emailRules"
                                    clearable required
                            ></v-text-field>
                            <v-text-field placeholder="Password" prepend-icon="lock" outlined shaped type="password" required
                                          v-model="user.password"
                                          :rules="PassRule"
                            ></v-text-field>
                            <v-text-field placeholder="Re-enter Password" prepend-icon="lock" outlined shaped type="password" required
                                          :rules="rePassRule"
                            ></v-text-field>
                            <v-checkbox success
                                        label="I accept terms and conditions"
                                        :rules="[v => !!v || 'You must agree to continue!']"
                                        required></v-checkbox>
                            <v-btn block dar @click="validate">Sign Up</v-btn>
                            </v-form>
                        </v-card-text>
                    </v-card>
                </div>
            </v-row>
            <v-row >
                <v-col cols="12" sm="12" lg="12" style="text-align: center">
                    <span style="color: black">Do you have an account?</span>&nbsp;&nbsp;&nbsp;&nbsp;<span><v-btn>Sign In</v-btn></span>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    export default {
        name: "Signup",
        data: function () {
            return {
                checkbox:false,
                valid: true,
                user: {
                    email: '',
                    password: '',
                    name: '',
                    lastname: '',
                },
                PassRule: [
                    v => !!v || 'Password is required',
                ],
                rePassRule: [
                    v => !!v || 'Re entering the password is required',
                    v => v != this.user.password || 'Password must mach'
                ],
                nameRules: [
                    v => !!v || 'Name is required',
                    v => (v && v.length <= 20) || 'Name must be less than 20 characters',
                ],
                emailRules: [
                    v => !!v || 'E-mail is required',
                    v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
                ],
                options: {
                    isLoggingIn: true,
                    shouldStayLoggedIn: true,
                },
            }
        },
        methods: {
            validate() {
                if (this.$refs.form.validate()) {
                    this.snackbar = true
                }
            }
        }
    }
</script>

<style scoped>

</style>