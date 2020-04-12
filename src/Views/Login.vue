<template>
    <div style="background-color: rgb(48,48,48); height: 100vh; padding-top: -100px">
        <div style="text-align: center">
            <img src="../assets/logo.png" height="200px"/>
        </div>
        <v-container>
            <v-row justify="center" align="center">
                <v-col cols="12" sm="12" lg="12">
                    <v-card light max-width="1000" style="left:6vw">
                        <v-card-title style="padding-left: 40%">
                            Log in to your account
                        </v-card-title>
                        <v-card-text>
                            <v-text-field placeholder="Email" prepend-icon="email"  outlined shaped type="email" clearable></v-text-field>
                            <v-text-field placeholder="Password" prepend-icon="lock" outlined shaped type="password"></v-text-field>
                            <v-checkbox success label="keep me logged in"></v-checkbox>
                            <v-btn block dark>Sign In</v-btn>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row >
                <v-col cols="12" sm="12" lg="12" style="text-align: center">
                    <span style="color: white">Don't have an account?</span>&nbsp;&nbsp;&nbsp;&nbsp;<span><v-btn>Sign Up</v-btn></span>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data: function () {
            return {
                checkbox:false,
                user: {
                    // email: 'admin@example.com',
                    // password: 'admin',
                    // name: 'John Doe',
                },
                options: {
                    isLoggingIn: true,
                    shouldStayLoggedIn: true,
                },
            }
        }
    }
</script>

<style scoped>

</style>