<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-light m-3 justify-content-between">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">TheApp</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarContent">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item active">
                        <router-link class="nav-link" to="/">Home</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" to="/about">About</router-link>
                    </li>
                </ul>

                <button type="button" class="btn btn-outline-success" @click="$router.push('/login')">Login</button>
            </div>
        </div>
    </nav>
</template>