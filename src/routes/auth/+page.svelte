<script lang="ts">
	import type { ValidationResult } from '$lib/internal/validation';
	import { Email, Gift, Lock, Password, User, Loader, BrandGoogle, BrandYandex, BrandVK } from '$lib/ui/icons';
	import { InputField } from '$lib/ui/kit';
	import { RegSchema, LoginSchema } from './validation';
	import { ZodError } from 'zod';
	import { slide } from 'svelte/transition';
	import { fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { page } from '$app/stores';
	import { goto, invalidateAll } from '$app/navigation';
	import { toastOptions, welcome } from '$lib/internal/toasts';
	import toast from 'svelte-french-toast';

	let authData = {email: '', name: '', password: '', passwordConfirm: '', referrer: $page.url.searchParams.get('ref') || ''};
	let newUser = authData.referrer !== "";
	let validationResult: ValidationResult = {};
	let loading = false;

	const auth = async (newUser: boolean) => {
		loading = true;
		try {
			const parsedData = newUser ? RegSchema.parse(authData) : LoginSchema.parse(authData);
			validationResult = {};
			const response = await fetch('/api/user/auth', {method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...parsedData, newUser }) });
			const result = await response.json();
			if (response.status !== 200) toast.error(result.message, toastOptions);
			else {
				document.cookie = result;
				await invalidateAll();
				if ($page.url.searchParams.get('type') === 'partner') await goto('/become-partner/registration');
				else await goto('/cabinet');
				welcome();
			}
		} catch (err) { if (err instanceof ZodError) validationResult = err.errors.reduce((f, e) => { f[e.path[0]] = e.message; return f; }, {}); }
		loading = false;
	};
	const toggle = (b: string) => {
		if (b === 'left') newUser ? (newUser = !newUser) : auth(newUser);
		else newUser ? auth(newUser) : (newUser = !newUser);
	};
</script>

<svelte:head>
	<title>{$page.data.metaTitle}</title>
	<meta name="description" content={$page.data.metaDesc} />
</svelte:head>

<main class="mobile" in:fly={{ x: 150, duration: $page.data.animation, easing: backOut }}>
	<div class='page v-center py-2.5'>
		<div class='column'>
			<h1>{#if newUser}Регистрация{:else}Вход{/if}</h1>
			<div class='w-full text-center lh-c calibri'>
				Хотите начать продававать свои товары? <br/>
				{#if $page.url.searchParams.get("type") === "partner"}<strong class='underline'>Нужно зарегистрироваться или войти</strong>
				{:else}<a href="/become-partner">Станьте нашим партнером!</a>{/if}
			</div>
		</div>
		<form class='column p-b-card bgw rounded-2xl l-ui' on:submit|preventDefault>
			{#if newUser}
				<div class='w-full form-item' transition:slide>
					<InputField id="name" labelText="Ваше имя" placeholder="Владислав" bind:value={authData.name}
						errorText={validationResult.name} err={validationResult.name?.length > 0}>
						<User />
					</InputField>
				</div>
			{/if}
				<div class='w-full form-item'>
					<InputField id="Email" labelText="Email" placeholder="example@email.com" bind:value="{authData.email}"
						errorText={validationResult.email} err={validationResult.email?.length > 0}>
						<Email />
					</InputField>
				</div>
				<div class='w-full form-item'>
					<div class="input-icon column">
						<div class='label-container fsbc gap-1.5'>
							<div><label for="password">Пароль</label> <span class="text-red-500 font-bold">∗</span></div>
							<div><span class="error-text">
								{#if validationResult.password}{validationResult.password}{/if}{#if !newUser && validationResult.password?.length > 0}, {/if}
								{#if !newUser}<a href="/">Забыли пароль?</a>{/if}
							</span></div>
						</div>
						<div class='relative'>
							<div class="icon-container fcc"><Password /></div>
							<input class="input-custom {validationResult.password?.length > 0 ? 'error' : ''}" bind:value={authData.password}
								type="password" id="password" minlength='8' placeholder="∗∗∗∗∗∗∗∗" />
						</div>
					</div>
				</div>
			{#if newUser}
				<div class='w-full form-item' transition:slide>
					<div class="input-icon column">
						<div class='label-container fsbc gap-1.5'>
							<div><label for="passwordConfirm">Повторите пароль</label> <span class="text-red-500 font-bold">∗</span></div>
							<div>{#if validationResult.passwordConfirm}<span class="error-text">{validationResult.passwordConfirm}</span>{/if}</div>
						</div>
						<div class='relative'>
							<div class="icon-container fcc"><Lock /></div>
							<input class="input-custom {validationResult.passwordConfirm?.length > 0 ? 'error' : ''}" bind:value={authData.passwordConfirm}
								type="password" id="passwordConfirm" minlength='8'  placeholder="∗∗∗∗∗∗∗∗"  />
						</div>
					</div>
				</div>
				<div class='w-full form-item' transition:slide>
					<InputField id="ref" labelText="Пригласительный код" placeholder="tpwtbctmog23" bind:value="{authData.referrer}"
						errorText={validationResult.referrer} err={validationResult.referrer?.length > 0}>
						<Gift />
					</InputField>
				</div>
			{/if}
			<div class='w-full form-item pt-1 px-5 gap-3 fsbc providers e-ui'>
				<div class="hr f-g1"></div>
				<div class="fcc gap-4">
					<a href="/" class="fcc"><BrandVK /></a>
					<a href="/" class="fcc"><BrandYandex /></a>
					<a href="/" class="fcc"><BrandGoogle /></a>
				</div>
				<div class="hr f-g1"></div>
			</div>
			{#if newUser}
				<div class='w-full form-item text-center lh-c calibri' transition:slide>
						Регистрируясь, вы принимаете <a href="/">условия публичной оферты</a> и соглашаетесь с <a href="/">политикой конфиденциальности</a>
				</div>
			{/if}
			<div class='w-full form-item flex'>
				<div class="brg flex w-full rounded-lg calibri">
					<button class="tab-toggle t-cut e-ui fcc gap-2" class:active={!newUser} on:click={() => toggle("left")} >
						{#if newUser}Есть аккаунт
						{:else}{#if loading}<Loader /> Обработка...{:else}Войти{/if}{/if}
					</button>
					<button class="tab-toggle t-cut e-ui fcc gap-2" class:active={newUser} on:click={() => toggle("right")} >
						{#if newUser}{#if loading}<Loader /> Обработка...{:else}Зарегистрироваться{/if}
						{:else}Нет аккаунта?{/if}
					</button>
				</div>
			</div>
		</form>
	</div>
</main>

<style lang="postcss">
	.page{gap:calc(var(--card) - 5px)}
	form{width:490px;max-width:100%}
	@media (orientation:portrait) and (max-width: 685px){form{padding-top: 7px}}
	@media (max-width: 685px){.providers{padding: 3px 0}}
	.form-item +.form-item{margin-top:calc(var(--pd) * 1.2)}
	.hr{height:2px;@apply bg-accent}
	.brg{border:2px solid #e2b59c;padding:5px 7px 5px 5px;background:#f9f0eb}
	.tab-toggle{padding:7px 10px 9px;background:0 0;width:41%;background:#f9f0eb;@apply rounded-lg;}
	.tab-toggle.active{font-weight:700;width:59%;background:#8B5D42;color:#fff}
</style>