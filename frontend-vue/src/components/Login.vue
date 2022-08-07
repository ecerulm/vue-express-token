<script setup>

import { login, loggedInStatus, updateLoggedInStatus, increaseCounter, counter } from '@/apiclient.js';

import { ref } from 'vue';

const username = ref("");
const password = ref("");

updateLoggedInStatus()

</script>


<template>

    <div class="container">
        <p>loggedInStatus: {{ loggedInStatus }}</p>
    </div>

    <div class="input-group mb-3">
        <button class="btn btn-outline-secondary" type="button" @click="updateLoggedInStatus">Check
            login status</button>
        <input type="text" class="form-control" :placeholder="`loggedInStatus: ${loggedInStatus}`">
    </div>

    <div class="input-group mb-3">
        <button class="btn btn-outline-secondary" type="button" @click="increaseCounter">increaseCounter</button>
        <input type="text" class="form-control" :placeholder="`counter value: ${counter}`">
    </div>


    <form @submit.prevent="login(username, password)">
        <div class="mb-3">
            <label for="exampleInputEmail1" class="form-label">username</label>
            <input type="text" class="form-control"
                v-model="username">
            <div class="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div class="mb-3">
            <label for="exampleInputPassword1" class="form-label">Password</label>
            <input type="password" class="form-control"  v-model="password">
        </div>

        <button type="submit" class="btn btn-primary">Submit</button>
    </form>
</template>