<script lang="ts">
	import { Link, Rocket, Loader } from '$lib/ui/icons';
	import { fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { page } from '$app/stores';
	import { goto, invalidateAll } from '$app/navigation';
	import { err, save, toastOptions } from '$lib/internal/toasts';
	import { transliterate } from '$lib/internal/helpers';
	import toast from 'svelte-french-toast'

	let type = "", name = "", slug = "", loading = false;

	$: transliterateName = transliterate(name ? name : "Мистерия");
	$: disabled = !(type !== "" && name !== "" && slug !== "");
	const send = async () => {
		loading = true;
		if (disabled) err();
		else {
			const slugTransliterate = transliterate(slug);
			const response = await fetch('/api/vendor/create/step-one', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify( { type, name, slug: slugTransliterate } )});
			if (response.ok) {
				await invalidateAll();
				await goto("/cabinet/partnerland/create/step-two");
				save();
			} else {
				const result = await response.json();
				toast.error(result.message, toastOptions);
			}
		}
		loading = false;
	}
</script>

<svelte:head>
	<title>{$page.data.metaTitle}</title>
	<meta name="description" content={$page.data.metaDesc} />
</svelte:head>

<main class="mobile" in:fly={{ x: 150, duration: $page.data.animation, easing: backOut }}>
	<div class='page v-center py-3'>
		<div class='column'>
			<h1>Поздравляем!</h1>
			<p>Теперь вы официально партнёр Мастерской подарков!</p>
		</div>
		<form class='fccc p-b-card bgw split-bor l-ui' on:submit|preventDefault={send}>
			<div class='w-full form-item column'>
				<div class='w-full text-center'>
					<p>Какая форма работы для вас удобнее?</p>
				</div>
				<div class='w-full text-center mb-2'>
					<p class='calibri underline'>Вы всегда сможете изменить всё в будущем.</p>
				</div>
				<div class='flex gap-2 lh-c calibri'>
					<div class="column gap-2 p-card bgw bor cursor-pointer" on:click={() => type = "master"}>
						<div class='fsbc'>
							<div><label for='master' class="cursor-pointer"><span class="label-text font-bold">Мастерская</span></label></div>
							<div><input type="radio" id='master' bind:group={type} class="radio radio-accent" value={"master"} /></div>
						</div>
						<p>Мало товаров, но взамен вам доступ уникальные "Услуги" - загрузите несколько примеров работ и работаете на заказ, общаясь с клиентами</p>
					</div>
					<div class="column gap-2 p-card bgw bor cursor-pointer" on:click={() => type = "shop"}>
						<div class='fsbc'>
							<div><label for='shop' class="cursor-pointer"><span class="label-text font-bold">Магазин</span></label></div>
							<div><input type="radio" id='shop' bind:group={type} class="radio radio-accent" value={"shop"} /></div>
						</div>
						<p>Нет услуг. Много товаров, несколько складов, продажа уже готовой продукции, общение с клиентами только в случае необходимости</p>
					</div>
				</div>
			</div>
			<div class='w-full md:w-9/12 form-item'>
				<div class="input-icon column">
					<div class='label-container fsbc gap-1.5'>
						<div class='f-s0'><label for="name">Название:</label> <span class="text-red-500 font-bold">∗</span></div>
						<div class='italic t-cut'> {#if type === "shop"}Магазин {:else}Мастерская {/if}«{name ? name : "..."}»</div>
					</div>
					<div class='relative'>
						<div class="icon-container fcc">
							<Rocket />
						</div>
						<input type="text" class="input-custom" id="name" placeholder="Например, Мистерия" bind:value={name} on:input={() => slug = transliterate(name)}/>
					</div>
				</div>
			</div>
			<div class='w-full md:w-9/12 form-item mb-2'>
				<div class="input-icon column">
					<div class='label-container fsbc gap-1.5'>
						<div class='f-s0'><label for="slug">Cсылка:</label> <span class="text-red-500 font-bold">∗</span></div>
						<div class='italic t-cut'>mpodarkov.com/partner/{slug ? slug : "..."}»</div>
					</div>
					<div class='relative'>
						<div class="icon-container fcc">
							<Link />
						</div>
						<input type="text" class="input-custom" id="slug" placeholder={transliterateName} bind:value={slug}/>
					</div>
				</div>
			</div>
			<button type='submit' class='btn btn-secondary w-11/12 font-bold fcc gap-2' {disabled}>
				{#if loading}<Loader />Обработка...{:else}Продолжить{/if}
			</button>
		</form>
	</div>
</main>

<style lang="postcss">
    .page{gap:calc(var(--card) - 5px)}
    form{width:700px;max-width:100%}
    @media (orientation:portrait) and (max-width: 685px){form{padding-bottom: 7px;padding-top: 7px}}
    .form-item +.form-item{margin-top:calc(var(--pd) * 1.2)}
</style>