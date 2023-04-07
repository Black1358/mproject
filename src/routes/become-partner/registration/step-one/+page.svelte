<script lang="ts">
	import { Loader } from '$lib/ui/icons';
	import { fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { page } from '$app/stores';
	import { goto, invalidateAll } from '$app/navigation';
	import { err, save } from '$lib/internal/toasts';
	import { stepOne } from '$lib/internal/partner/become';

	let gov = '', agree = false, loading = false;
	$: disabled = !(gov !== '' && agree);
	const send = async () => {
		loading = true;
		if (disabled) err();
		else {
			const result = await stepOne(agree, gov);
			if (result) {
				await invalidateAll();
				await goto('/become-partner/registration/step-two');
				save();
			} else err();
		}
		loading = false;
	};
</script>

<svelte:head>
	<title>{$page.data.metaTitle}</title>
	<meta name="description" content={$page.data.metaDesc} />
</svelte:head>

<div class='page v-center'>
	<form class='column v-center p-b-card bg-white l-ui g-card rounded-2xl' on:submit|preventDefault={send} in:fly={{ x: 150, duration: $page.data.animation, easing: backOut }}>
		<div class='column'>
			<h1>Добро пожаловать!</h1>
			<p class='text-center'>Чтобы стать нашим партнером, нужно пройти быструю регистрацию в несколько этапов</p>
		</div>
		<div class='column gap-2.5 my-px w-full'>
			<div class="radio-group">
				<input type="radio" id='fiz' bind:group={gov} class="radio radio-accent" value={"fiz"} />
				<label for='fiz' class="cursor-pointer"><span class="label-text">Физическое лицо</span></label>
			</div>
			<div class="radio-group">
				<input type="radio" id='sam' bind:group={gov} class="radio radio-accent" value={"sam"} />
				<label for='sam' class="cursor-pointer"><span class="label-text">Самозанятость</span></label>
			</div>
			<div class="radio-group">
				<input type="radio" id='ip' bind:group={gov} class="radio radio-accent" value={"ip"} />
				<label for='ip' class="cursor-pointer"><span class="label-text">Индивидуальный предприниматель</span></label>
			</div>
			<div class="radio-group">
				<input type="radio" id='ur' bind:group={gov} class="radio radio-accent" value={"ur"} />
				<label for='ur' class="cursor-pointer"><span class="label-text">Юридическое лицо</span></label>
			</div>
		</div>
		<div class="checkbox-container w-full v-center">
			<input type="checkbox" id='agree' class="checkbox checkbox-accent" bind:checked={agree}>
			<label for='agree' class="cursor-pointer"><span class="label-text">Являюсь резидентом РФ (если нет, <a href="/">кликните сюда</a>) и соглашаюсь с <a href="/">условиями публичной партнёрской оферты</a>.</span></label>
		</div>
		<button type='submit' class='btn btn-secondary w-full font-bold fcc gap-2' {disabled}>
			{#if loading}<Loader />Обработка...{:else}Продолжить{/if}
		</button>
	</form>
</div>

<style>
    .radio-group {@apply flex gap-3;}
    .checkbox-container {@apply flex py-1 gap-3;}
</style>