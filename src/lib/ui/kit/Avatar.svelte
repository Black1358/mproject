<script lang="ts">
	export let src: string;
</script>

<img class="avatar" {src} alt="Аватар пользователя" />

<style>
    .avatar {
        @apply w-16 h-16 bg-cover bg-center rounded-full;
    }
</style>