<template>
    <div>
        <div id="box">
            <v-btn text id="register_btn" :style="{'color': login.activated ? 'black': 'red'}"
                   :class="{'disable-events': !login.activated}"
                   @click="login.activated = false">Register
            </v-btn>
            <v-btn text id="login_btn" :style="{'color': !login.activated ? 'black': 'red'}"
                   :class="{'disable-events': login.activated}"
                   @click="login.activated = true">Login
            </v-btn>
            <template v-if="login.activated">
                <v-form id="login">
                    <v-container fluid>
                        <v-row>
                            <v-text-field
                                    v-model="login.email"
                                    label="Email"
                                    style="font-family: kalam;"
                                    type="email"
                                    filled
                                    solo-inverted
                            ></v-text-field>
                        </v-row>
                        <v-row>
                            <v-text-field
                                    v-model="login.password"
                                    label="Password"
                                    style="font-family: kalam;"
                                    type="password"
                                    filled
                                    solo-inverted
                            ></v-text-field>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-btn color="#2F116D" style="color: white; font-family: kalam">Login</v-btn>
                            </v-col>
                            <v-col>
                                <v-btn text style="font-family: kalam; font-size: 12px; color: #2F116D">Forget
                                    Password?
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-form>
            </template>

            <template v-else>
                <v-form id="register">
                    <v-row style="padding: 0">
                        <v-col style="padding-top: 0; padding-bottom: 0">
                            <v-text-field
                                    v-model="user.firstName"
                                    :rules="firstNameRules"
                                    label="First Name"
                                    style="font-family: kalam;"
                                    type="text"
                                    filled
                                    solo-inverted
                            ></v-text-field>
                        </v-col>
                        <v-col style="padding-top: 0; padding-bottom: 0">
                            <v-text-field
                                    v-model="user.lastName"
                                    :rules="LastNameRules"
                                    label="Last Name"
                                    style="font-family: kalam;"
                                    type="email"
                                    filled
                                    solo-inverted
                            ></v-text-field>
                        </v-col>

                    </v-row>

                    <v-row style="padding: 0">
                        <v-col style="padding-top: 0; padding-bottom: 0">
                            <v-text-field
                                    v-model="user.email"
                                    label="Email"
                                    :rules="emailRules"
                                    style="font-family: kalam;"
                                    type="text"
                                    filled
                                    solo-inverted
                            ></v-text-field>
                        </v-col>
                        <v-col style="padding-top: 0; padding-bottom: 0">
                            <v-text-field
                                    v-model="user.phone"
                                    label="Phone Number"
                                    :rules="phoneRules"
                                    hint="09123456789"
                                    style="font-family: kalam;"
                                    type="phone"
                                    filled
                                    solo-inverted
                            ></v-text-field>
                        </v-col>

                    </v-row>

                    <v-row style="padding: 0">
                        <v-col style="padding-top: 0">
                            <v-text-field
                                    v-model="user.password"
                                    label="Password"
                                    style="font-family: kalam;"
                                    :rules="passRule"
                                    type="password"
                                    filled
                                    solo-inverted
                            ></v-text-field>
                        </v-col>
                        <v-col style="padding-top: 0">
                            <v-text-field
                                    ref="password"
                                    v-model="user.password2"
                                    :rules="rePassRule"
                                    style="font-family: kalam;"
                                    label="Confirm Password"
                                    type="password"
                                    filled
                                    solo-inverted
                            ></v-text-field>
                        </v-col>

                    </v-row>
                    <v-row>
                        <v-col style="padding-top: 0">
                            <v-btn color="#2F116D" @click="register" style="color: white; font-family: kalam">Signup</v-btn>
                        </v-col>

                    </v-row>
                </v-form>
            </template>
        </div>
        <div id="overlay_box">
            <div id="teapo">TEAPO</div>
            <div id="detail">Toefl Exam And Practice Online</div>
        </div>
        <div id="top_triangle">
        </div>
        <div id="bottom_triangle">

        </div>
    </div>
</template>

<script>
    export default {
        name: "RegisterLogin",
        data: function () {
            return {
                login: {
                    activated: false,
                    email: '',
                    password: '',
                },
                checkbox: false,
                valid: true,
                user: {
                    email: '',
                    password: '',
                    firstName: '',
                    lastName: '',
                    phone: '',
                    password2: '',
                },
                passRule: [
                    v => !!v || 'Password is required',
                    v => (v && v.length > 8) || 'Password must be at least 8 characters'
                ],
                firstNameRules: [
                    v => !!v || 'First name is required',
                    v => (v && v.length <= 20) || 'First name must be less than 20 characters',
                ],
                phoneRules: [
                    v => !!v || 'Phone number is required',
                    v => /^09\d\d\d\d\d\d\d\d\d/.test(v) || 'Phone Number must be valid',
                ],
                LastNameRules: [
                    v => !!v || 'Last name is required',
                    v => (v && v.length <= 20) || 'Last name must be less than 20 characters',
                ],
                rePassRule: [
                    v => !!v || 'Re entering the password is required',
                    v => v === this.user.password || 'Password must mach'
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
        computed: {},
        methods: {
            register(){

            }
        }
    }
</script>
<style scoped>
    @import "../assets/fonts/fonts.css";

    #register {
        margin-top: 40px;
        margin-left: 310px;
        margin-right: 20px;
    }

    #login {
        margin-top: 89px;
        margin-left: 360px;
        margin-right: 70px;
    }

    #login_btn {
        font-family: kalam;
        position: absolute;
        font-size: 15px;
        padding: 0;
        width: 90px;
        top: calc((100% - 393px) / 2 + 200px);
        left: calc((100% - 800px) / 2);
        text-align: center;
    }

    #register_btn {
        font-family: kalam;
        position: absolute;
        font-size: 15px;
        padding: 0;
        width: 90px;
        top: calc((100% - 393px) / 2 + 170px);
        left: calc((100% - 800px) / 2);
        text-align: center;
    }

    #detail {
        font-family: kalam;
        color: white;
        font-size: 12px;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        padding-top: 197.5px;
        text-align: center;
    }

    #teapo {
        font-family: kalam;
        position: absolute;
        color: white;
        font-weight: bold;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        padding-top: 170.5px;
        font-size: 26px;
        margin: auto;
        text-align: center;
    }

    #top_triangle {
        position: absolute;
        left: calc((100% - 800px) / 2 + 90px);
        top: calc((100% - 393px) / 2 - 150px);
        margin: auto;
        width: 0;
        height: 0;
        border-bottom: 150px solid rgb(24, 6, 80);
        border-right: 200px solid transparent;
    }

    #bottom_triangle {
        position: absolute;
        left: calc((100% - 800px) / 2 + 90px);
        top: calc((100% - 393px) / 2 + 393px);
        margin: auto;
        width: 0;
        height: 0;
        border-top: 150px solid rgb(24, 6, 80);
        border-left: 200px solid transparent;
    }

    #overlay_box {
        position: absolute;
        top: 0;
        bottom: 0;
        left: calc((100% - 800px) / 2 + 90px);
        margin: auto;
        background-color: rgb(24, 6, 80);
        width: 200px;
        height: 393px;

    }

    #box {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        background-color: rgb(229, 229, 229);
        width: 800px;
        height: 393px;
    }

    .disable-events {
        pointer-events: none
    }

</style>
