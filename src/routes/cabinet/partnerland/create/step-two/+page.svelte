<script lang="ts">
	import {fly} from 'svelte/transition';
	import {backOut} from 'svelte/easing';
	import {page} from "$app/stores";
	import {onMount} from 'svelte';
	import {err, save} from '$lib/internal/toasts'
	import {goto, invalidateAll} from '$app/navigation';
	import {vendorStepTwo} from '$lib/internal/vendor/create';
	let name = '', coordinates = [], address = '', porch = "", sfloor = '', sflat = '', comment = "", cdekID = "", cdekCityCode = "";
	let region = $page.data.region;
	$: next = (cdekID !== "" && cdekCityCode !== "" && address !== "" && address !== "" && coordinates.length > 0);
	const onChoose = (cdek) => {cdekID = cdek.id; cdekCityCode = cdek.city}
	const onCord = async (map) => {coordinates[0] = map.latitude; coordinates[1] = map.longitude; address = await map.address;}

	onMount( async () => {
			// eslint-disable-next-line no-undef
			new ISDEKWidjet({
				cityFrom: 'Омск',
				hidecash: true,
				hidedress: true,
				hidedelt: true,
				mode: "pvz",
				link: 'forpvz',
				region: "true",
				path: 'https://widget.cdek.ru/widget/scripts/',
				servicepath: 'https://mpodarkov.com/widget/scripts/service.php',

				onChoose: onChoose,
				onCord: onCord,
			});
			console.log(region);
		})
	const send = async () => {
		if (!next) err();
		const result = await vendorStepTwo(name, coordinates[0], coordinates[1], address, porch, sfloor, sflat, comment, cdekID, cdekCityCode);
		if (result) {
			await invalidateAll();
			save();
			await goto("/cabinet/partnerland/create/step-three");
		} else err();
	}



</script>

<svelte:head>
	<title>{$page.data.metaTitle}</title>
	<meta name="description" content={$page.data.metaDesc} />
	<script type="text/javascript" id="ISDEKscript" src="/cdek.js" charset="utf-8"></script>
</svelte:head>

<main class="classic" in:fly={{ x: 150, duration: $page.data.animation, easing: backOut }}>
	<div class='page'>

		<h1>Создание склада</h1>
		<p>Мы разработали систему для расчёта минимальной стоимости доставки. Если у вас несколько точек, с которых будет осуществляться отправка товаров, мы расчитаем с какого будет дешевле!</p>
		<p>Укажите адрес с помощью карты, куда будет приезжать курьер и выберите удобный пункт выдачи СДЭК:</p>
		<form class='column gap-4' on:submit={send} >
				<div class="column gap-2">
					<label for='name' class="cursor-pointer"><span class="label-text">Название (только для вашего удобства)</span></label>
					<input type='text' id='name' bind:value={name}/>
				</div>
				<div class="column gap-2">
					<!--suppress CssUnusedSymbol -->
					<style>.CDEK-widget__sidebar{height: auto}.CDEK-widget__sidebar-button-point{display: none}</style>
					<div id="forpvz" style="height:375px;"></div>
				</div>
				Заполнять ли эти поля - сугубо ваше решения.
				<div class='flex gap-2'>
					<div class="column gap-2">
						<label for='porch' class="cursor-pointer"><span class="label-text">Подъезд:</span></label>
						<input type='text' id='porch' bind:value={porch}/>
					</div>
					<div class="column gap-2">
						<label for='sfloor' class="cursor-pointer"><span class="label-text">Этаж:</span></label>
						<input type='text' id='sfloor' bind:value={sfloor}/>
					</div>
					<div class="column gap-2">
						<label for='sflat' class="cursor-pointer"><span class="label-text">Квартира:</span></label>
						<input type='text' id='sflat' bind:value={sflat}/>
					</div>
				</div>
				<div class="column gap-2">
					<label for='comment' class="cursor-pointer"><span class="label-text">Комментарий курьеру:</span></label>
					<textarea id='comment' cols='30' rows='5' bind:value={comment}></textarea>
				</div>
				Код ПВЗ: {cdekID}, Код города: {cdekCityCode}, {coordinates[0]}, {coordinates[1]}, {address}
				<button type='submit' class='btn btn-primary w-11/12 s-center' disabled={!next}><b>Продолжить</b></button>
			</form>
	</div>
</main>

