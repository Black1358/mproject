<script lang="ts">
	import type { Requisites } from '$lib/internal/partner/become';
	import { Doc, Tel, User, Loader } from '$lib/ui/icons';
	import { InputField } from '$lib/ui/kit';
	import { fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { page } from "$app/stores";
	import { goto, invalidateAll } from "$app/navigation";
	import { err, save } from '$lib/internal/toasts'
	import { suggestionsParty, stepTwo, checkSamStatus } from '$lib/internal/partner/become';

	let partner = JSON.parse($page.data.partner), inn = "", contactSurname = "", contactName = "", contactPatronymic = "", contactPhone = "", dadata = "", suggestions = [], focusInput = false, loading = false;
	$: disabled = !(contactSurname !== "" && contactName !== "" && contactPhone !== "" && inn !== "");
	const send = async () => {
		loading = true;
		if (disabled) err();
		else {
			if (partner.type === "sam") dadata = await checkSamStatus(inn);
			const data: Requisites = {type: partner.type, contactSurname, contactName, contactPatronymic, contactPhone, inn, dadata}
			const result = await stepTwo(data);
			if (result) {
				await invalidateAll();
				await goto("/become-partner/registration/step-three");
				save();
			} else err();
		}
		loading = false;
	}
	const suggestionsPartyInput = async () => {if (partner.type === "ip" || partner.type === "ur") suggestions = await suggestionsParty(inn, partner.type === "ip" ? "INDIVIDUAL" : "LEGAL")}
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
					<div><label for="inn">ИНН</label> <span class="text-red-500 font-bold">∗</span></div>
					<div></div>
				</div>
				<div class='relative'>
					<div class="icon-container fcc"><Doc /></div>
					<input id='inn' type="text" class="input-custom" bind:value={inn} placeholder={(partner?.type === "ip" || partner?.type === "ur") ? "Выберите из выпадающих подсказок" : "5603048139"}
					on:input={suggestionsPartyInput} on:focus={() => (focusInput = true)} on:blur={() => (setTimeout( () => {focusInput = false}, 400 ))} />
					{#if suggestions.length > 2 && focusInput && (partner.type === "ip" || partner.type === "ur")}
						<ul class="suggestions calibri">
							{#each suggestions as suggestion}
								<li class="suggestion"
										on:click={() => { inn = suggestion.data.inn; suggestions = []; dadata = suggestion; if (partner?.type === "ip") {contactSurname = suggestion.data.fio.surname; contactName = suggestion.data.fio.name; contactPatronymic = suggestion.data.fio.patronymic;}}}
										on:keydown={(e) => { if (e.key === 'Enter') { inn = suggestion.data.inn; suggestions = []; dadata = suggestion}}}
										tabindex='0'>
									{suggestion.data.inn} - {suggestion.value}
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
		</div>
		<div class='form-item'>
			<InputField id="nickname" labelText="Фамилия" placeholder="Шишкин" bind:value="{contactSurname}" errorText="" err={false} >
				<User />
			</InputField>
		</div>
		<div class='form-item'>
			<InputField id="nickname" labelText="Имя" placeholder="Александр" required={true} bind:value="{contactName}" errorText="" err={false} success={false}>
				<User />
			</InputField>
		</div>
		<div class='form-item'>
			<InputField id="nickname" labelText="Отчество" placeholder="Ярославович" required={false} bind:value="{contactPatronymic}" errorText="" err={false} success={false}>
				<User />
			</InputField>
		</div>
		<div class='form-item'>
			<InputField id="nickname" labelText="Телефон" placeholder="+7..." required={true} bind:value="{contactPhone}" errorText="" err={false} success={false}>
				<Tel />
			</InputField>
		</div>
		<div class='pt-2 fcc form-item'>
			<button type='submit' class='btn btn-secondary w-11/12 font-bold fcc gap-2' {disabled}>
				{#if loading}<Loader />Обработка...{:else}Продолжить{/if}
			</button>
		</div>
	</form>
</div>

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
  }
	.suggestion { cursor: pointer; padding: 5px; }
	.suggestion:hover { background-color: #f0f0f0; }
</style>