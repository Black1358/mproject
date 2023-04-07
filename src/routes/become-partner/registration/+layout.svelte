<script lang="ts">
	import { Gov, DataUser, Bank } from '$lib/ui/icons';
	import { Step } from '$lib/ui/kit';
	import { fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { page } from "$app/stores";
	$: partner = JSON.parse($page.data.partner);
</script>

<main class="mobile">
	<div class='column s-stretch g-card py-4 w-full' in:fly={{ y: -150, duration: $page.data.animation, easing: backOut }}>
		<div class='fcc w-full gap-3 px-3 calibri'>
			<div class="f-s1 fcc min-w-0"><Gov size=70 fill="#e2b59c" /></div>
			<div class="f-s1 fcc min-w-0"><Step fill={$page.url.pathname !== "/become-partner/registration/step-one" ? "#8B5D42" :"#C5CAE1"} /></div>
			<div class="f-s1 fcc min-w-0"><DataUser size=70 fill={$page.url.pathname !== "/become-partner/registration/step-one" ? "#e2b59c" :"#C5CAE1"}/></div>
			<div class="f-s1 fcc min-w-0"><Step fill={$page.url.pathname === "/become-partner/registration/step-three" ? "#8B5D42" :"#C5CAE1"} /></div>
			<div class="f-s1 fcc min-w-0"><Bank size=70 fill={$page.url.pathname === "/become-partner/registration/step-three" ? "#e2b59c" :"#C5CAE1"}/></div>
		</div>
		<slot />
	</div>
</main>

<style>
	.column{max-width:510px}
	@media (max-width: 375px){.column{gap:0}}
</style>