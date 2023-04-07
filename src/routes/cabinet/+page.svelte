<script lang="ts">
	import { copyToClipboard } from '$lib/internal/helpers';
	import { Exit, Settings, Loader } from '$lib/ui/icons';
	import { logout } from '$lib/internal/cabinet/logout';
	import { goto, invalidateAll } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { page } from '$app/stores';
	import { getUserAvatarURL } from "$lib/internal/files";
	import defaultAvatar from "$lib/resources/icons/user.svg";

	const user = JSON.parse($page.data.user);
	const partner = JSON.parse($page.data.partner);
	const wallet = JSON.parse($page.data.wallet);
	const avatar = user.avatar ? `${getUserAvatarURL(user.id, user.avatar)}` : defaultAvatar;

	let loading = false;

	const logoutHandler = async () => {
		loading = true;
		await logout();
		loading = false;
	}

	import { stepConsole } from '$lib/internal/partner/become';
	import { err, good } from '$lib/internal/toasts';
	const send = async () => {
	/*
		const options = {
			method: 'POST',
			headers: {accept: 'application/json', 'content-type': 'application/json'},
			body: JSON.stringify({scenario_id: 'mp001', name: 'Тест', phone: '+75465'})
		};

		fetch('https://api.konsol.pro/v2/contractor_invites', options)
			.then(response => response.json())
			.then(response => console.log(response))
			.catch(err => console.error(err));
*/
		const result = await stepConsole("check");
		if (result) {
			await invalidateAll();
			good();
			await goto("/cabinet/partnerland/create/step-one");
		} else err();
	}
</script>

<svelte:head>
	<title>{$page.data.metaTitle}</title>
	<meta name="description" content={$page.data.metaDesc} />
</svelte:head>

<main class="mobile" in:fly={{ x: 150, duration: $page.data.animation, easing: backOut }}>
	<div class='page s-stretch'>

		<div class='fsbc p-b-card'>
			<button class='btn-icon fcc' on:click={logoutHandler}>{#if loading}<Loader fill='currentColor' />{:else}<Exit fill='currentColor'/>{/if}</button>

			<div>
				{#if partner === null}<a class='btn' href='/become-partner'>Стать партнёром</a>
				{:else if partner?.status === "one"}<a class='btn' href='/become-partner/registration'>Заполните реквизиты</a>
				{:else if partner?.status === "two"}<a class='btn' href='/become-partner/registration'>Заполните банк</a>
				{:else if partner?.status === "three"}<button class='btn' on:click={send}>Ждём в консоле</button>
				{:else if partner?.status === "console"}<a href='/cabinet/partnerland/create/step-one' class='btn'>Создайте бренд</a>
				{:else if partner?.status === "vendor-one"}<a href='/cabinet/partnerland/create/step-two' class='btn'>Создайте склад</a>
				{:else if partner?.status === "vendor-two"}<a href='/cabinet/partnerland' class='btn'>Партнерлэнд</a>
				{/if}
			</div>

			<a class='btn-icon fcc' href='/cabinet/settings'><Settings fill='currentColor'/></a>
		</div>

		<div class='fsbc p-b-card rounded-tl-3xl rounded-tr-3xl ' style='border-top: 1px #ccc solid'>
			<div class='f-g1'>{wallet.bonuses} Баллов</div>
			<div class='column'>
				<div class='fcc'><img class="avatar-image" width="100" height="100" src="{avatar}" alt="Аватар" /></div>
				<div class='text-center'>{user.name}</div>
			</div>
			<div class='f-g1'>{wallet.lvl} %  Кешбэк</div>
		</div>

		<div>
			{#if wallet.lvl > 1}
				Ваш реферальный код: <div><button on:click={() => copyToClipboard(user.id)}>Копи</button>{user.id}</div>
			{/if}
		</div>
	</div>
</main>