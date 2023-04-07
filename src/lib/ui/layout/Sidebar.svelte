<script lang="ts">
	import LogoFull from '$lib/ui/layout/LogoFull.svelte';
	import { onMount } from 'svelte';
	import { page } from "$app/stores";

	$: user = JSON.parse($page.data.user);
	$: partner = JSON.parse($page.data.partner);
	$: vendor = JSON.parse($page.data.vendor);

	let items = 7;
	let menu;
	let menuItems;
	let trajectory;
	let swipeThreshold;
	let currentAngle = 0;
	let visibleAngle = 22;
	let visibleItems = 5;

	$: if (!$page.url.pathname.startsWith("/cabinet")) {
		if (!$page.url.pathname.startsWith("/cabinet/cart")) {
			currentAngle = 0;
			if (menu && trajectory) calculatePositions();
		}
	} else {
		if (!$page.url.pathname.startsWith("/cabinet/cart")) {
			currentAngle = -2 * 5;
			if (menu && trajectory) calculatePositions();
		}
	}

	const degToRad = (degrees) => degrees * (Math.PI / 180);

	function calculatePositions() {
		const centerX = trajectory.offsetWidth / 8;
		const centerY = trajectory.offsetHeight / 2;

		let hiddenItems = items - visibleItems;
		let visibleAngleStep = visibleAngle / (visibleItems - 1);
		let hiddenAngleStep = (360 - visibleAngle) / hiddenItems;

		menuItems.forEach((menuItem, index) => {
			let angle;
			let currentIndex = (index + Math.round(currentAngle / 5)) % items

			if (currentIndex < 0) currentIndex += items;

			let visibleItemIndex = (currentIndex) % visibleItems;
			let hiddenItemIndex = (currentIndex - visibleItems) % hiddenItems;

			if (currentIndex < visibleItems) {
				angle = degToRad(270 - visibleAngle / 2 + visibleItemIndex * visibleAngleStep);
			} else {
				angle = degToRad(270 + visibleAngle / 2 + hiddenItemIndex * hiddenAngleStep + visibleAngleStep + 120);
			}

			let x = centerX + (trajectory.offsetHeight / 2 - menuItem.offsetWidth / 2) * Math.cos(angle) - menuItem.offsetWidth / 2;
			let y = centerY + (trajectory.offsetHeight / 2 - menuItem.offsetHeight / 2) * Math.sin(angle) - menuItem.offsetHeight / 2;

			menuItem.style.left = `${x}px`;
			menuItem.style.top = `${y}px`;
		});
	}

	let animationFrame;
	let touchStartX: number | undefined;
	const handleTouchStart = (event) => {touchStartX = event.touches[0].clientX}
	const handleTouchMove = (event) => {
		event.preventDefault();
		if (animationFrame) cancelAnimationFrame(animationFrame);
		animationFrame = requestAnimationFrame(() => {
			const touchCurrentX = event.touches[0].clientX;
			const deltaX = touchCurrentX - touchStartX;
			const scrollCoefficient = 4 * 5;
			if (Math.abs(deltaX) > 10) {
				currentAngle += (deltaX / swipeThreshold) * scrollCoefficient;
				touchStartX = touchCurrentX;
				calculatePositions();
			}
		});
	}
	const handleTouchEnd = () => {touchStartX = undefined}
	const handleWheel = (event) => {
		event.preventDefault();
		currentAngle += event.deltaY < 0 ? 5 : -5;
		calculatePositions();
	}
	onMount(() => {
		swipeThreshold = 0.9 * window.innerWidth;
		menuItems = menu.querySelectorAll('.nav-block');
		calculatePositions();
	});
</script>

<aside class="flex g-sb gap-3 l-ui calibri">
	<div class="column gap-1.5 mob-none">
		<a href="/" class="fcc"><LogoFull /></a>
		<div class="hr bga f-g0"></div>
		<div class='fcc'>
				{#if partner === null}<a class="partner t-cut e-ui py-px bga px-2 text-sm font-bold rounded-lg" href='/become-partner'>Стать партнёром</a>
				{:else if partner?.status === "one"}<a class="partner t-cut e-ui py-px bga px-2 text-sm font-bold rounded-lg" href='/become-partner/registration'>Указать реквизиты</a>
				{:else if partner?.status === "two"}<a class="partner t-cut e-ui py-px bga px-2 text-sm font-bold rounded-lg" href='/become-partner/registration'>Указать банк</a>
				{:else if partner?.status === "three"}<button class="partner t-cut e-ui py-px bga px-2 text-sm font-bold rounded-lg">Ждём в консоле</button>
				{:else if partner?.status === "console"}<a href='/cabinet/partnerland/create/step-one' class="partner t-cut e-ui py-px bga px-2 text-sm font-bold rounded-lg">Создать бренд</a>
				{:else if partner?.status === "vendor-one"}<a href='/cabinet/partnerland/create/step-two' class="partner t-cut e-ui py-px bga px-2 text-sm font-bold rounded-lg">Создать склад</a>
				{:else if partner?.status === "vendor-two"}<a href='/cabinet/partnerland' class="partner t-cut e-ui py-px bga px-2 text-sm font-bold rounded-lg">
					{#if vendor?.type === "shop"}Мой магазин{:else}Моя мастерская{/if}
				</a>
				{/if}
		</div>
	</div>
	<nav class="fcc gap-2 f-g1 l-ui" bind:this={menu} on:wheel={handleWheel} on:touchstart={handleTouchStart} on:touchmove={handleTouchMove} on:touchend={handleTouchEnd}>
		<div class="nav-block l-ui" class:active="{$page.url.pathname === '/'}">
			<a href="/" class="nav-title flex v-center p-1 gap-1 rounded-lg e-ui font-bold" aria-label="Главная">
				<div class='fcc p-0.5'>
					<svg width="26" height="26" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" role="none">
						<path class="icon e-ui" d="M17.54 2.047c-1.039.096-1.392.305-3.92 2.324-2.047 1.635-2.131 1.695-2.148 1.53-.038-.36-.201-.725-.418-.937-.42-.409-.38-.404-3.267-.403-2.897.002-2.861-.003-3.269.427-.378.397-.378.396-.381 3.915l-.004 3.187-1.425 1.175c-1.575 1.299-1.636 1.373-1.675 2.035-.02.339-.001.433.149.719.221.419.56.667.967.706.443.043.701-.071 1.343-.592.32-.26.596-.473.613-.473.018 0 .039 3.328.048 7.395l.017 7.395.198.57c.274.787.608 1.329 1.149 1.86.735.722 1.452 1.071 2.461 1.197.697.086 5.898.084 6.306-.003.361-.078.714-.363.915-.74.127-.237.132-.318.162-2.854.029-2.516.035-2.622.162-2.935.392-.961 1.122-1.576 2.079-1.752 1.272-.235 2.595.672 2.946 2.019.075.288.092.782.092 2.67 0 2.715.012 2.793.479 3.247.222.215.358.293.597.345.408.087 5.609.089 6.306.003 1.912-.239 3.373-1.656 3.753-3.641.071-.371.085-1.675.085-7.701 0-3.99.014-7.255.031-7.255.016 0 .3.215.629.477.757.603 1.041.696 1.567.51.548-.193.89-.7.89-1.317 0-.428-.137-.76-.425-1.029-.111-.104-3.379-2.727-7.262-5.829-5.498-4.393-7.157-5.688-7.5-5.855-.721-.353-1.39-.469-2.25-.39" fill="#fff" fill-rule="evenodd"/>
					</svg>
				</div>
				<div class='mob-none t-cut'>Главная</div>
			</a>
		</div>
		<div class="nav-block l-ui" class:active='{$page.url.pathname.startsWith("/search")}'>
			<a href="/search" class="nav-title flex v-center p-1 gap-1 rounded-lg e-ui font-bold" aria-label="Поиск">
				<div class='fcc p-0.5'>
					<svg width="26" height="26" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" role="none">
						<path class="icon e-ui" d="M13.35 3.035c-.099.014-.437.054-.75.09-.75.086-1.979.404-2.746.709-3.715 1.481-6.362 4.359-7.423 8.072a12.462 12.462 0 0 0-.401 4.237c.381 4.218 2.966 7.936 6.82 9.809 1.325.644 2.874 1.092 4.269 1.236 1.003.103 2.706.03 3.591-.154 2.31-.479 4.107-1.351 5.934-2.877l.534-.447 4.056 3.973c5.16 5.055 5.425 5.305 5.759 5.453a1.442 1.442 0 0 0 1.873-.706c.135-.292.149-.851.027-1.141-.114-.274-1.07-1.245-5.133-5.213-3.748-3.661-4.461-4.344-4.675-4.481l-.146-.094.311-.538c.806-1.396 1.398-3.405 1.5-5.085.297-4.89-2.386-9.432-6.86-11.616a12.173 12.173 0 0 0-3.544-1.112c-.571-.089-2.621-.168-2.996-.115m2.67 2.995c1.861.304 3.707 1.269 5.101 2.667 1.31 1.314 2.121 2.812 2.502 4.623.154.732.153 2.937-.002 3.642-.859 3.916-4.011 6.77-8.076 7.311-2.626.35-5.407-.5-7.437-2.272-1.471-1.284-2.61-3.237-2.99-5.13-.148-.735-.142-2.746.01-3.551.21-1.106.814-2.478 1.55-3.519 1.493-2.113 3.992-3.549 6.723-3.864.587-.068 1.929-.02 2.619.093" fill="#fff" fill-rule="evenodd"/>
					</svg>
				</div>
				<div class='mob-none t-cut'>Поиск</div>
			</a>
		</div>
		<div class="nav-block l-ui" class:hub={!($page.url.pathname.startsWith("/cabinet") && !$page.url.pathname.startsWith("/cabinet/cart")) && currentAngle === 0} class:active={$page.url.pathname.startsWith("/catalog")} >
			<a href="/catalog/showcases" class="nav-title flex v-center p-1 gap-1 rounded-lg l-ui font-bold" aria-label="Каталог">
				<div class='fcc p-0.5'>
					<svg class='w-auto' height="26" viewBox="0 0 35 36" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path class="icon e-ui" d="M12.279 1.09c-1.38.231-7.612 1.476-10.062 2.01-.594.13-1.162.286-1.262.347-.288.177-.66.616-.822.97-.134.291-.146.373-.115.798.043.6.373 2.386 1.29 6.996.791 3.973.948 4.643 1.162 4.983.187.296.526.588.848.73.465.206.844.194 2.282-.071 2.953-.543 9.877-1.966 10.24-2.104.213-.081.713-.567.884-.859.379-.647.396-.526-1.301-9.086-.731-3.686-.765-3.805-1.224-4.228-.525-.483-1.085-.625-1.92-.486M19.6 2.446a2.127 2.127 0 0 0-1.273 1.104c-.143.308-.155.405-.193 1.496-.053 1.53-.052 8.309.002 9.8.05 1.406.103 1.574.672 2.121.629.603.131.562 6.859.562 6.766 0 6.226.047 6.895-.599.65-.628.601-.042.601-7.043V3.879l-.138-.303c-.164-.363-.627-.82-1.047-1.033l-.299-.151-5.967.005c-3.281.002-6.032.025-6.112.049M3.967 19.189c-1.047.029-1.158.043-1.394.168-.367.196-.777.63-.96 1.016l-.157.334.016 6.023c.018 6.958-.039 6.323.624 6.996.282.286.453.41.646.467.385.114 12.02.114 12.463 0 .252-.065.366-.145.709-.498.291-.3.431-.496.487-.681.117-.387.115-12.074-.002-12.53-.062-.244-.155-.392-.424-.679-.504-.539-.58-.561-2.208-.617-1.487-.052-7.959-.051-9.8.001m16.362-.003c-.826.033-.892.044-1.183.206a2.326 2.326 0 0 0-.91.954l-.147.289-.012 5.943c-.008 4.554.006 6.004.061 6.205.154.565.59 1.077 1.163 1.368l.295.149H31.63l.343-.183c.42-.224.746-.567.982-1.035l.178-.354v-5.791c-.001-5.832-.016-6.333-.212-6.712-.15-.29-.612-.708-.984-.891l-.349-.171-5.192-.006c-2.856-.003-5.586.01-6.067.029" fill="#fff" fill-rule="evenodd"/>
					</svg>
				</div>
				<div class='mob-none t-cut'>Каталог</div>
			</a>
			<ul class="sub-menu mob-none">
				<li class="e-ui" class:active='{$page.url.pathname.startsWith("/catalog/showcases/category/household-goods")}'>
					<a class="e-ui" href="/catalog/showcases/category/household-goods">Товары для дома</a></li>
				<li class="e-ui" class:active='{$page.url.pathname.startsWith("/catalog/showcases/category/decorative-goods")}'>
					<a class="e-ui" href="/catalog/showcases/category/decorative-goods">Декоративные товары</a></li>
				<li class="e-ui" class:active='{$page.url.pathname.startsWith("/catalog/showcases/category/accessories-and-mementos")}'>
					<a class="e-ui" href="/catalog/showcases/category/accessories-and-mementos">Аксессуары и сувениры</a></li>
				<li class="e-ui" class:active='{$page.url.pathname.startsWith("/catalog/showcases/category/toys-and-games")}'>
					<a class="e-ui" href="/catalog/showcases/category/toys-and-games">Игрушки и игры</a></li>
				<li class="e-ui" class:active='{$page.url.pathname.startsWith("/catalog/showcases/category/gift-sets")}'>
					<a class="e-ui" href="/catalog/showcases/category/gift-sets">Подарочные наборы</a></li>
				<li class="e-ui" class:active='{$page.url.pathname.startsWith("/catalog/showcases/category/confectionery")}'>
					<a class="e-ui" href="/catalog/showcases/category/confectionery">Кондитерские изделия</a></li>
				<li class="e-ui" class:active='{$page.url.pathname.startsWith("/catalog/showcases/category/edible-bouquets")}'>
					<a class="e-ui" href="/catalog/showcases/category/edible-bouquets">Съедобные букеты</a></li>
				<li class="e-ui" class:active='{$page.url.pathname.startsWith("/catalog/showcases/category/flowers")}'>
					<a class="e-ui" href="/catalog/showcases/category/flowers">Цветы</a></li>
			</ul>
		</div>
		<div class="nav-block desk-none l-ui" class:active='{$page.url.pathname.startsWith("/cabinet/cart")}'>
			<a href="/cabinet/cart" class="nav-title flex v-center p-1 gap-1 rounded-lg e-ui font-bold" aria-label="Корзина">
				<div class='fcc p-0.5'>
					<svg width="26" height="26" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" role="none">
						<path class="icon e-ui"  d="M16.17 1.179c-1.457.31-2.664.977-3.782 2.091-1.375 1.369-2.103 2.948-2.226 4.825l-.039.588-2.656.03-2.655.03-.411.23c-.453.253-.899.676-1.131 1.072-.127.216-.161.38-.209 1.002-.034.437-.059 5.136-.06 11.4L3 33.103l.195.381a2.992 2.992 0 0 0 1.274 1.261l.418.205 13.202.017 13.201.016.426-.21c.518-.256 1.021-.744 1.25-1.21.12-.247.179-.489.221-.914.034-.348.05-4.873.04-11.319l-.017-10.74-.171-.348c-.383-.781-1.149-1.366-1.936-1.48-.227-.033-1.44-.06-2.695-.061L26.126 8.7l-.072-.675c-.198-1.861-.857-3.216-2.219-4.565-1.229-1.217-2.837-2.067-4.335-2.293-.77-.116-2.761-.109-3.33.012m2.731 2.327c1.272.17 2.339.697 3.186 1.575.906.938 1.286 1.797 1.461 3.304l.036.315H12.646l.043-.465c.234-2.497 2.133-4.423 4.681-4.746.614-.078.83-.076 1.531.017m-6.454 9.799c.181 1.536.809 2.715 1.988 3.735 1.475 1.275 3.643 1.692 5.498 1.057 2.052-.703 3.668-2.671 3.809-4.642l.036-.495h2.502v.197c0 .108-.028.425-.062.705-.232 1.885-1.144 3.546-2.697 4.906-1.492 1.307-3.05 1.942-4.981 2.031-2.433.111-4.433-.654-6.2-2.373-1.443-1.404-2.232-3.036-2.358-4.881l-.04-.585h2.464l.041.345" fill="#fff" fill-rule="evenodd"/>
					</svg>
				</div>
				<div class='mob-none t-cut'>Корзина</div>
			</a>
		</div>
		<div class="nav-block desk-none l-ui" class:hub={$page.url.pathname.startsWith("/cabinet") && currentAngle === -10} class:active='{$page.url.pathname.startsWith("/cabinet/messages")}'>
			<a href="/cabinet/messages" class="nav-title flex v-center p-1 gap-1 rounded-lg l-ui font-bold" aria-label="Сообщения">
				<div class='fcc p-0.5'>
					<svg width="26" height="26" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path class="icon e-ui" d="M12.333 26.124h16.575l2.854 2.228V11.65h1.619c.43 0 .841.17 1.145.47.303.302.474.712.474 1.138V34.97l-7.213-5.63H13.952c-.429 0-.84-.169-1.144-.47a1.603 1.603 0 0 1-.475-1.137v-1.609Zm-4.12-3.216L1 28.537V3.608c0-.426.17-.835.474-1.137A1.625 1.625 0 0 1 2.62 2h24.286c.43 0 .84.17 1.145.471.303.302.474.71.474 1.137v19.3H8.213Z"/>
					</svg>
				</div>
			</a>
		</div>
		<div class="nav-block desk-none l-ui" class:active='{$page.url.pathname.startsWith("/cabinet/favourites")}'>
			<a href="/cabinet/favourites" class="nav-title flex v-center p-1 gap-1 rounded-lg l-ui font-bold" aria-label="Избранное">
				<div class='fcc p-0.5'>
					<svg width="26" height="26" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path class="icon e-ui" d="m18 33-2.465-2.196c-2.862-2.562-5.228-4.773-7.098-6.631-1.87-1.858-3.357-3.527-4.462-5.006-1.105-1.477-1.877-2.835-2.315-4.074A11.285 11.285 0 0 1 1 11.292c0-2.647.893-4.857 2.678-6.631S7.687 2 10.35 2a9.86 9.86 0 0 1 4.207.93c1.332.619 2.48 1.491 3.443 2.618.963-1.127 2.11-2 3.442-2.619A9.86 9.86 0 0 1 25.65 2c2.663 0 4.888.887 6.672 2.66C34.107 6.436 35 8.646 35 11.293c0 1.295-.22 2.562-.658 3.8-.44 1.24-1.212 2.598-2.317 4.075-1.105 1.48-2.592 3.148-4.462 5.006-1.87 1.858-4.236 4.069-7.098 6.63L18 33Z"/>
					</svg>
				</div>
			</a>
		</div>
		<div class="nav-block desk-none l-ui" class:active='{$page.url.pathname === "/cabinet"}'>
			<a href="/cabinet" class="nav-title flex v-center p-1 gap-1 rounded-lg l-ui font-bold" aria-label="Кабинет">
				<div class='fcc p-0.5'>
					<svg width="26" height="26" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" role="none">
						<path class="icon e-ui"  d="M17.01 1.08c-3.458.377-6.479 2.727-7.525 5.855a7.059 7.059 0 0 0-.408 2.193c-.164 3.728 2.156 6.991 5.928 8.336 1.115.398 1.704.492 3.085.493 1.008.001 1.299-.02 1.821-.13 1.958-.415 3.518-1.241 4.799-2.541.649-.659 1.126-1.302 1.498-2.018 1.17-2.248 1.271-4.66.294-6.94-1.125-2.623-3.586-4.547-6.56-5.128-.742-.146-2.164-.203-2.932-.12m-6.78 19.798c-3.708.032-3.721.032-4.11.172-1.484.533-2.545 1.588-2.969 2.95-.154.493-.196 2.31-.07 3.031.306 1.756 1.153 3.131 2.761 4.48 2.343 1.966 6.277 3.228 10.673 3.422 4.608.203 8.26-.425 11.415-1.964 2.747-1.34 4.41-3.099 5.105-5.399.156-.517.163-.597.165-1.89l.003-1.35-.208-.54c-.509-1.322-1.517-2.274-2.894-2.731l-.491-.163-7.83-.025c-4.306-.014-9.504-.01-11.55.007" fill="#fff" fill-rule="evenodd"/>
					</svg>
				</div>
			</a>
		</div>
	</nav>

	<div class="column gap-1.5 mob-none">
		<div class="cabinet column a-ui rounded-lg p-1 gap-1.5">
			<a href="/cabinet" class="addition flex v-center e-ui rounded-lg p-0.5 gap-1 text-right" class:active='{$page.url.pathname === "/cabinet"}' aria-label="Кабинет" style="min-height: 34px">
				<div class="fcc">
					{#if user?.avatar}
						<img width="30" height="30" class="ava"
								 src="http://127.0.0.1:8090/api/files/_pb_users_auth_/{user.id}/{user.avatar}" alt="Аватар" role="none">
					{:else}
						<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" role="none">
							<circle cx="15" cy="15" r="15" fill="#2A4060"/>
							<path class='icon e-ui' d="M20.4 16.3334C20.957 16.3334 21.4911 16.544 21.8849 16.9191C22.2788 17.2942 22.5 17.8029 22.5 18.3333V18.81C22.5 21.1947 19.553 23 15.5 23C11.447 23 8.5 21.2887 8.5 18.81V18.3333C8.5 17.8029 8.72125 17.2942 9.11507 16.9191C9.5089 16.544 10.043 16.3334 10.6 16.3334H20.4ZM15.5 7C16.0516 7 16.5978 7.10346 17.1073 7.30448C17.6168 7.5055 18.0799 7.80014 18.4699 8.17157C18.8599 8.54301 19.1692 8.98396 19.3803 9.46927C19.5914 9.95458 19.7 10.4747 19.7 11C19.7 11.5253 19.5914 12.0454 19.3803 12.5307C19.1692 13.016 18.8599 13.457 18.4699 13.8284C18.0799 14.1999 17.6168 14.4945 17.1073 14.6955C16.5978 14.8965 16.0516 15 15.5 15C14.3861 15 13.3178 14.5786 12.5302 13.8284C11.7425 13.0784 11.3 12.0609 11.3 11C11.3 9.93913 11.7425 8.92173 12.5302 8.17157C13.3178 7.42143 14.3861 7 15.5 7Z" />
						</svg>
					{/if}
				</div>
				<div class="f-g1 t-cut text-center font-bold text-sm pr-1.5">
					{#if user?.id !== undefined}
						{#if user?.name}{user?.name}
						{:else}Кабинет{/if}
					{:else}Аутентификация{/if}
				</div>
			</a>
			<div class="fcc gap-1.5 ">
				{#if user === null}
					<a href="/auth" class="fcc">
						<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
							<circle cx="15" cy="15" r="14" fill="#7294C7"/>
							<path d="M13.025 9.033c-.786.096-1.061.199-1.317.491-.2.228-.199.307.005.347.268.052.65.291.756.473.291.502.405 1.759.284 3.131-.09 1.026-.301 1.425-.753 1.425-.132 0-.507-.31-.735-.607-.405-.529-.768-1.259-1.617-3.255-.242-.571-.485-1.1-.539-1.176-.062-.086-.198-.171-.366-.228-.241-.081-.431-.089-1.868-.075-1.464.015-1.612.024-1.737.109-.286.194-.18.538.813 2.643 1.088 2.305 2.135 4.015 3.665 5.983.348.448 1.075 1.095 1.701 1.513.744.498 1.043.648 1.801.908l.607.208 1.13.018c1.28.019 1.462-.009 1.683-.26.137-.156.149-.201.174-.687.064-1.261.521-2.014 1.054-1.737.222.115.539.407.768.708.448.587 1.183 1.339 1.55 1.584.6.402.79.452 1.705.447 1.442-.006 2.618-.075 2.825-.166.302-.132.386-.246.386-.524 0-.156-.027-.266-.075-.306-.041-.034-.075-.097-.075-.139 0-.135-.349-.72-.692-1.161-.182-.234-.763-.856-1.291-1.383-.536-.534-1.006-1.047-1.063-1.16a1.028 1.028 0 0 1-.005-.879c.054-.112.42-.626.812-1.144 1.421-1.872 1.969-2.702 2.245-3.402.193-.491.191-.768-.007-.958l-.152-.145-2.186.014c-1.598.01-2.201.03-2.241.073-.03.032-.106.205-.168.384-.181.517-.913 2.052-1.25 2.621a15.38 15.38 0 0 1-.597.926c-.348.488-.934 1.103-1.05 1.103-.119 0-.431-.341-.498-.545-.039-.115-.057-.828-.057-2.225 0-1.193-.021-2.127-.049-2.227-.056-.195-.259-.427-.471-.537-.274-.143-.964-.216-1.98-.208-.536.004-1.043.015-1.125.025" fill="#fff" fill-rule="evenodd"/>
						</svg>
					</a>
					<a href="/auth" class="fcc">
						<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
							<circle cx="15" cy="15" r="14" fill="#FC3F1D"/>
							<path d="M17.3972 8.4375H15.9019C13.3224 8.4375 12.014 9.75 12.014 11.7375C12.014 13.95 12.9112 15.0375 14.8178 16.35L16.3131 17.4375L12.014 24.15H8.5L12.6121 18.0375C10.2196 16.35 8.91122 14.7375 8.91122 11.925C8.91122 8.4 11.3037 6 15.9019 6H20.5V24.0375H17.5093V8.4H17.3972V8.4375Z" fill="white"/>
						</svg>
					</a>
					<a href="/auth" class="fcc">
						<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
							<circle cx="15" cy="15" r="14" fill="white"/>
							<path d="M25 15.2221C25 14.3999 24.9319 13.7999 24.7846 13.1777H15.204V16.8888H20.8276C20.7142 17.811 20.102 19.1999 18.7414 20.1332L18.7223 20.2575L21.7515 22.5572L21.9614 22.5777C23.8888 20.8333 25 18.2666 25 15.2221Z" fill="#4285F4"/>
							<path d="M15.2042 25C17.9593 25 20.272 24.111 21.9614 22.5777L18.7414 20.1332C17.8797 20.7221 16.7234 21.1333 15.2042 21.1333C12.5057 21.1333 10.2155 19.3889 9.39907 16.9778L9.2794 16.9877L6.12959 19.3766L6.08839 19.4888C7.7664 22.7555 11.2132 25 15.2042 25Z" fill="#34A853"/>
							<path d="M9.39907 16.9778C9.18365 16.3556 9.05901 15.6888 9.05901 14.9999C9.05901 14.311 9.18368 13.6444 9.38776 13.0222L9.38206 12.8896L6.19277 10.4624L6.08842 10.511C5.39683 11.8666 5 13.3888 5 14.9999C5 16.6111 5.39681 18.1333 6.08839 19.4888L9.39907 16.9778Z" fill="#FBBC05"/>
							<path d="M15.2042 8.86665C17.1203 8.86665 18.4128 9.67776 19.1498 10.3556L22.0296 7.60001C20.2609 5.9889 17.9593 5 15.2042 5C11.2132 5 7.76643 7.24435 6.08842 10.511L9.38776 13.0222C10.2155 10.611 12.5057 8.86665 15.2042 8.86665Z" fill="#EB4335"/>
						</svg>
					</a>
				{:else}
					<a href="/cabinet/favourites" class="fcc icon" class:active='{$page.url.pathname.startsWith("cabinet/favourites")}' aria-label="Моё избранное">
						<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" role="none">
							<circle class='svg-bg e-ui' cx="15" cy="15" r="15"/>
							<path class='svg-icon e-ui' d="M15 22.68L13.84 21.64C12.4933 20.4267 11.38 19.38 10.5 18.5C9.62 17.62 8.92 16.8299 8.4 16.1296C7.88 15.4299 7.5168 14.7867 7.3104 14.2C7.10347 13.6133 7 13.0133 7 12.4C7 11.1467 7.42 10.1 8.26 9.26C9.1 8.42 10.1467 8 11.4 8C12.0933 8 12.7533 8.14667 13.38 8.44C14.0067 8.73333 14.5467 9.14667 15 9.68C15.4533 9.14667 15.9933 8.73333 16.62 8.44C17.2467 8.14667 17.9067 8 18.6 8C19.8533 8 20.9 8.42 21.74 9.26C22.58 10.1 23 11.1467 23 12.4C23 13.0133 22.8968 13.6133 22.6904 14.2C22.4835 14.7867 22.12 15.4299 21.6 16.1296C21.08 16.8299 20.38 17.62 19.5 18.5C18.62 19.38 17.5067 20.4267 16.16 21.64L15 22.68Z"/>
						</svg>
					</a>
					<a href="/cabinet/messages" class="fcc icon" class:active='{$page.url.pathname.startsWith("cabinet/messages")}' aria-label="Мои сообщения">
						<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" role="none">
							<circle class='svg-bg e-ui' cx="15" cy="15" r="15"/>
							<path class='svg-icon e-ui' d="M12.3333 19.4286H20.133L21.4762 20.4838V12.5714H22.2381C22.4402 12.5714 22.634 12.6517 22.7768 12.7946C22.9197 12.9375 23 13.1313 23 13.3333V23.619L19.6057 20.9524H13.0952C12.8932 20.9524 12.6994 20.8721 12.5565 20.7292C12.4136 20.5863 12.3333 20.3925 12.3333 20.1905V19.4286ZM10.3943 17.9048L7 20.5714V8.7619C7 8.55984 7.08027 8.36604 7.22316 8.22316C7.36604 8.08027 7.55984 8 7.7619 8H19.1905C19.3925 8 19.5863 8.08027 19.7292 8.22316C19.8721 8.36604 19.9524 8.55984 19.9524 8.7619V17.9048H10.3943Z"/>
						</svg>
					</a>
					<a href="/cabinet/cart" class="fcc icon" class:active='{$page.url.pathname.startsWith("cabinet/im")}' aria-label="Личные данные">
						<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
							<circle class='svg-bg e-ui' cx="15" cy="15" r="15"/>
							<path class='svg-icon e-ui' d="M11.0625 24.25C11.8219 24.25 12.4375 23.6344 12.4375 22.875C12.4375 22.1156 11.8219 21.5 11.0625 21.5C10.3031 21.5 9.6875 22.1156 9.6875 22.875C9.6875 23.6344 10.3031 24.25 11.0625 24.25Z"/>
							<path class='svg-icon e-ui' d="M20.6875 24.25C21.4469 24.25 22.0625 23.6344 22.0625 22.875C22.0625 22.1156 21.4469 21.5 20.6875 21.5C19.9281 21.5 19.3125 22.1156 19.3125 22.875C19.3125 23.6344 19.9281 24.25 20.6875 24.25Z"/>
							<path class='svg-icon e-ui' d="M23.1281 10.1898C23.0315 10.0716 22.9099 9.97647 22.7719 9.91121C22.634 9.84596 22.4832 9.81224 22.3306 9.8125H9.25309L8.98969 8.31805C8.9616 8.15886 8.87832 8.01466 8.75448 7.91078C8.63063 7.80689 8.47415 7.74997 8.3125 7.75H5.5625C5.38016 7.75 5.2053 7.82243 5.07636 7.95136C4.94743 8.0803 4.875 8.25516 4.875 8.4375C4.875 8.61984 4.94743 8.7947 5.07636 8.92364C5.2053 9.05257 5.38016 9.125 5.5625 9.125H7.73586L9.69781 20.2445C9.7259 20.4036 9.80918 20.5478 9.93302 20.6517C10.0569 20.7556 10.2134 20.8125 10.375 20.8125H21.375C21.5573 20.8125 21.7322 20.7401 21.8611 20.6111C21.9901 20.4822 22.0625 20.3073 22.0625 20.125C22.0625 19.9427 21.9901 19.7678 21.8611 19.6389C21.7322 19.5099 21.5573 19.4375 21.375 19.4375H10.9516L10.7093 18.0625H21.0931C21.3315 18.0622 21.5625 17.9795 21.747 17.8285C21.9315 17.6774 22.0581 17.4673 22.1055 17.2336L23.343 11.0461C23.3728 10.8964 23.369 10.7419 23.3318 10.5938C23.2947 10.4457 23.2251 10.3077 23.1281 10.1898Z"/>
						</svg>
					</a>
				{/if}
			</div>
		</div>
		<div class="hr bga f-g0"></div>
		<a class="addition flex v-center e-ui p-0.5 gap-0.5 rounded-lg font-bold text-xs" href="/information-center"  class:active='{$page.url.pathname.startsWith("information-center")}'>
			<div class="fcc">
				<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" role="none">
					<circle cx="9" cy="9" r="9" fill="#2A4060"/>
					<path class="icon e-ui" d="M8.30477 11.6881V12.2037H9.73746C9.73746 12.2037 9.39115 10.8764 9.5 10.5C9.60885 10.1236 9.71732 9.83276 10 9.5C10.3073 9.13825 11 8.80912 11 8.80912C11 8.80912 11.7573 8.47731 12.1162 8.10842C12.4603 7.75476 12.6196 7.43038 12.7692 7.02675C12.9234 6.62312 13.0005 6.17187 13.0005 5.673C13.0005 4.96551 12.8372 4.33513 12.5107 3.78184C12.1887 3.22854 11.7306 2.79317 11.1366 2.47571C10.547 2.15824 9.85311 1.99951 9.05492 1.99951C8.32022 1.99951 7.65129 2.14464 7.04811 2.43489C6.44947 2.72514 5.96648 3.14465 5.59913 3.6934C5.23632 4.24216 5.03677 4.90203 5.00049 5.673H6.71478C6.75106 5.13786 6.88484 4.70475 7.11614 4.37368C7.34743 4.04261 7.63542 3.79997 7.98009 3.64578C8.32477 3.49158 8.68304 3.41449 9.05492 3.41449C9.48123 3.41449 9.86899 3.50293 10.2182 3.6798C10.5674 3.85666 10.8463 4.10837 11.0549 4.43491C11.2635 4.76143 11.3608 5.12356 11.3678 5.59137C11.3736 5.98104 11.3274 6.2113 11.1774 6.57097C11.0045 6.98535 10.5 7.5 10.5 7.5C10.5 7.5 10.2191 7.68781 9.95288 7.93154C9.54048 8.30904 9.30621 8.53222 9 9C8.76087 9.36531 8.63971 9.58634 8.5 10C8.28765 10.6288 8.31384 10.8219 8.30477 11.6881Z"/>
					<circle class="icon e-ui" cx="9" cy="15" r="1.5"/>
				</svg>
			</div>
			<div class='t-cut'>Информационный центр</div>
		</a>
		{#if false}
			<a class="addition flex v-center e-ui p-0.5 gap-0.5 rounded-lg font-bold text-xs" href="/catalog/corporate-gifts" class:active='{$page.url.pathname.startsWith("catalog/corporate-gifts")}'>
				<div class="fcc">
					<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" role="none">
						<circle cx="9" cy="9" r="9" fill="#2A4060"/>
						<path class="icon e-ui" d="M4.19999 14.0769C3.87 14.0769 3.58759 13.9628 3.3528 13.7346C3.1176 13.5062 3 13.2315 3 12.9109V6.49796C3 6.17731 3.1176 5.90292 3.3528 5.67477C3.58759 5.44624 3.87 5.33197 4.19999 5.33197H6.6V4.16598C6.6 3.84534 6.71759 3.57075 6.9528 3.34221C7.18759 3.11406 7.46999 3 7.79999 3H10.2C10.53 3 10.8126 3.11406 11.0478 3.34221C11.2826 3.57075 11.4 3.84534 11.4 4.16598V5.33197H13.8C14.1299 5.33197 14.4126 5.44624 14.6478 5.67477C14.8825 5.90292 15 6.17731 15 6.49796V12.9109C15 13.2315 14.8825 13.5062 14.6478 13.7346C14.4126 13.9628 14.1299 14.0769 13.8 14.0769H4.19999ZM4.19999 12.9109H13.8V6.49796H4.19999V12.9109ZM7.79999 5.33197H10.2V4.16598H7.79999V5.33197Z"/>
					</svg>
				</div>
				<div class='t-cut'>Корпоративные подарки</div>
			</a>
		{/if}
	</div>
</aside>
<div class="trajectory" bind:this="{trajectory}"></div>

<style lang="postcss">
    .trajectory {
        position: fixed;
        bottom: -400vw;
        left: -150vw;
        width: 400vw;
        height: 400vw;
        overflow: visible;
        z-index: -100;
    }


    :root {--sidebar:173px}
    aside {padding: 11px 5px 5px 5px;position:fixed;left:0;bottom:0;z-index:100;background:#0d264a}
		.hr{@apply w-4/6 h-px mx-auto;}
    .partner{line-height:113%;color:#0d264a;letter-spacing:1px;&.active,&:focus,&:focus-visible,&:hover{background:#f9f0eb;color:#0d264a}}
    .nav-block {
        width: 100%;
        .nav-title {
            color: #f0f4fe;font-size: 19px;
            .icon {fill: #3d516e;}
            &:focus,&:focus-visible,&:hover {.icon {fill: #e2b59c;}}
        }
        .sub-menu {
            margin: 0 0 0 8px;padding: 2px 3px 2px 9px;
            border-left: 1px #f0f4fe80 solid;
            list-style: none;font-size: 14px;
            li {
                margin: 0 -11px;padding: 0 6px;opacity: 0.65;
                a {display: block;width: 100%;color: #fff;}
                &.active,&:focus,&:focus-visible,&:hover {
                    background: linear-gradient(90deg,rgba(255, 255, 255, 0) 0%,#e2b59c 1%,#e2b59c 99%,rgba(255, 255, 255, 0) 100%);opacity: 1;
                    a {color: #000;}
                }
            }
        }
        &.active {
            .nav-title {background: #3d516e;.icon {fill: #e2b59c;}}
            .sub-menu {border-left: 1px #f0f4fe solid;li {opacity: 0.9;}}
        }
    }
    .addition{letter-spacing:0.02em;background:#3d516e;color:#fff;.icon{fill: #e2b59c;}&.active,&:focus,&:focus-visible,&:hover{background:#f0f4fe;color: #0d264a;.icon {fill:#f0f4fe}}}
    .cabinet {background:#2a4060;.icon{.svg-bg{fill:#0d264a}.svg-icon{fill:#f9f0eb}&.active,&:focus,&:focus-visible,&:hover{.svg-bg{fill:#f0f4fe}.svg-icon{fill:#0d264a}}}}

    @media (max-width:900px) or (max-height:430px) {
        :root {--sidebar:67px}
        nav {width:100%;height:100%;position:relative}
        nav {justify-content: space-evenly;}
        .nav-block {
            width: unset;
            .nav-title {
                padding: 0;
                .icon {fill: #fff;}
            }
            &.active,&:focus,&:focus-visible,&:hover {
                .nav-title{
                    background:unset;
                    .icon {fill: #e2b59c;}
                }
            }
        }
        .hub {
						width: 30px;
						height: 30px;
            .nav-title {
                padding: 9px;border-radius: 50%;background: #f9f0eb;
                margin: -9px;
                .icon {fill: #8B5D42;}
            }
            &.active,&:focus,&:focus-visible,&:hover{
                .nav-title {
                    background: #8B5D42;
                    .icon {fill: #f9f0eb;}
                }
            }
        }
        .nav-block {
            position: absolute;
            transition: all 0.15s linear;
            color: white;
        }
    }

    @media (orientation: landscape) or (min-width:900px) {
        aside,nav {flex-direction:column}
        aside {width: var(--sidebar);height: 100vh;border-right:2px solid rgba(255, 255, 255, 0.13);}
        nav{align-items:flex-start}
        @media (max-height:550px) {.sub-menu{display:none}}
        @media (max-height:430px) or (max-width:900px) {
            aside {border-radius: 0 45px 45px 0/0 48% 48% 0;}
        }
    }
    @media (orientation:portrait) and (max-width:900px){
        aside,nav{-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row}
        aside{width:100%;height:var(--sidebar);border-radius:48% 48% 0 0/45px 45px 0 0;border-top:2px solid rgba(255, 255, 255, 0.13)}
        nav{-webkit-box-align:end;-ms-flex-align:end;align-items:flex-end}
    }
</style>