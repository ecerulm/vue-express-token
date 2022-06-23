<script setup>

import { login, loggedInStatus, updateLoggedInStatus } from '@/apiclient.js'

import { ref } from 'vue'

const username = ref("")
const password = ref("")

</script>


<template>

    <div class="container">
        <p>loggedInStatus: {{ loggedInStatus }}</p>
    </div>

    <div class="input-group mb-3">
        <button class="btn btn-outline-secondary" type="button" id="button-addon1" @click="updateLoggedInStatus">Check login status</button>
        <input type="text" class="form-control" :placeholder="`loggedInStatus: ${loggedInStatus}`" >
    </div>


    <form @submit.prevent="login(username, password)">
        <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">username</label>
            <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" v-model="username">
            <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Password</label>
            <input type="password" class="form-control" id="exampleInputPassword1" v-model="password" >
        </div>
        <div class="mb-3 form-check">
            <input type="checkbox" class="form-check-input" id="exampleCheck1">
            <label class="form-check-label" for="exampleCheck1">Check me out</label>
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
</template>