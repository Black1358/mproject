<script lang="ts">
	import { Bank, Gov, Loader } from '$lib/ui/icons';
	import { InputField } from '$lib/ui/kit';
	import { fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { page } from "$app/stores";
	import { goto, invalidateAll } from "$app/navigation";
	import { err, good } from '$lib/internal/toasts';
	import { stepThree, suggestionsBank } from '$lib/internal/partner/become';

	let paymentAccount = "", bank = "", query = "", suggestions = [], focusInput = false, loading = false;
	$: disabled = !(bank !== "" && paymentAccount !== "");
	const send = async () => {
		loading = true;
		if (disabled) err();
		else {
			const result = await stepThree(paymentAccount, bank);
			if (result) {
				await invalidateAll();
				await goto("/cabinet/");
				good();
			} else err();
		}
		loading = false;
	}
	const suggestionsPartyInput = async () => {suggestions = await suggestionsBank(query)}
</script>

<svelte:head>
	<title>{$page.data.metaTitle}</title>
	<meta name="description" content={$page.data.metaDesc} />
</svelte:head>

<div class='page v-center'>
	<form class='column v-center p-b-card bg-white l-ui rounded-2xl' on:submit|preventDefault={send} in:fly={{ x: 150, duration: $page.data.animation, easing: backOut }}>
			<div class='form-item'>
				<div class="input-icon column">
					<div class='label-container fsbc'>
						<div><label for="bank">Банк</label> <span class="text-red-500 font-bold">∗</span></div>
						<div></div>
					</div>
					<div class='relative'>
						<div class="icon-container fcc">
							<Gov />
						</div>
						<input id='bank' type="text" class="input-custom" bind:value={query} placeholder="Выберите из выпадающих подсказок"  on:input={suggestionsPartyInput} on:focus={() => (focusInput = true)} on:blur={() => (setTimeout( () => {focusInput = false}, 3000000 ))} />
						{#if suggestions.length > 0 && focusInput}
							<ul class="suggestions calibri">
								{#each suggestions as suggestion}
									<li class="suggestion lh-c"
											on:click={() => { query = suggestion.value; suggestions = []; bank = suggestion}}
											on:keydown={(e) => { if (e.key === 'Enter') { query = suggestion.value; suggestions = []; bank = suggestion}}}
											tabindex='0'>
										{suggestion.value}<br>
										<span class='italic text-gray-600'>{suggestion.data.address.value}</span>
									</li>
								{/each}
							</ul>
						{/if}
					</div>
				</div>
			</div>
			<div class='form-item'>
				<InputField id="nickname" labelText="Расчётный счёт" placeholder="123456789" bind:value="{paymentAccount}" errorText="" err={false} success={false}>
					<Bank />
				</InputField>
			</div>
			<p class='form-item'>Вывод средств осуществляется автоматически каждый понедельник и четверг. Скорость перевода на ваш банковский счёт зависит от вашего банка.</p>
			<div class='pt-2 fcc form-item'>
				<button type='submit' class='btn btn-secondary w-11/12 font-bold fcc gap-2' {disabled}>
					{#if loading}<Loader />Обработка...{:else}Продолжить{/if}
				</button>
			</div>
	</form>
</div>

<!--suppress CssInvalidPropertyValue -->
<style>
    form{width:425px;max-width:100%}
    @media (orientation:portrait) and (max-width: 685px){form{border-color:#fff}}
    .form-item{@apply w-full;}
    .form-item +.form-item{margin-top:calc(var(--pd) * 1.2)}
    .suggestions {
        position: absolute;
        background-color: white;
        border: 1px solid #ccc;
        border-radius: 0 0 8px 8px;
        list-style: none;
        margin: 0;
        padding: 0;
        width: 100%;
        top: 32px;
        z-index: 50;
        max-height: 266px;
        overflow-y: scroll;
        scrollbar-width: thin;
    }
    .suggestions::-webkit-scrollbar{width:-1}
    .suggestion { cursor: pointer; padding: 5px; }
    .suggestion:hover { background-color: #f0f0f0; }
</style>