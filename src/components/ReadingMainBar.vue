<template>
    <div>
        <v-toolbar prominent extended flat class="toolbar" height="110px">
            <v-spacer></v-spacer>
            <div class="button_right">
                <img class="btn" src="../assets/reviewd.png"  >
                <img class="btn" src="../assets/vold.png"  >
                <img class="btn" src="../assets/help.png" >
            </div>
        </v-toolbar>
    </div>
</template>

<script>
    export default {
        name: "ReadingMainBar"
    }
</script>

<style scoped>
    .toolbar{
        background: linear-gradient(to right, #4148a2,#822a42);
    }
    .btn{
        height: 80px;
        width: auto;
    }
    .button_right{
        margin-top: 50px;
    }
</style>