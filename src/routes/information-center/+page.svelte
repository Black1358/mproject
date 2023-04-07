<script lang="ts">
	import {fly} from 'svelte/transition';
	import {backOut} from 'svelte/easing';
	import {page} from "$app/stores";
	$: duration = $page.data.animation || 300;
	$: metaTitle = $page.data.metaTitle || "Мастерская подарков";
	$: metaDesc = $page.data.metaDesc  || "Мастерская подарков";
	import AccordionItem from "$lib/ui/components/AccordionItem.svelte";
</script>

<svelte:head>
	<title>{metaTitle}</title>
	<meta name="description" content={metaDesc} />
</svelte:head>

<main class="classic fcc" in:fly={{ x: 150, duration, easing: backOut }}>
	<div class='column max-w-full g-card'>
		<h1 class="text-4xl">Информационный центр</h1>
		<div class="max-w-5xl w-full bgw mx-auto column p-card g-card sm:flex-row-reverse v-center sm:w-11/12">
			<div class="fcc w-full sm:w-4/12"><img class="rounded-lg" alt="hero" src="https://dummyimage.com/720x400"></div>
			<div class="column w-full sm:w-8/12">
				<h2 class="sm:text-3xl text-2xl text-gray-900 text-center sm:text-left lh">Не нашли ответ?</h2>
				<p class="text-sm text-center sm:text-left lh">Наша служба поддержки работает 24/7!</p>
				<div class="fcc sm:place-content-start mt-3 mb-2">
					<button class="btn btn-primary">Задать вопрос</button>
				</div>
			</div>
		</div>

		<div class='max-w-5xl flex g-card g-center mt-3'>
			<a href='/' class='bgw p-card fccc sm:w-3/12 w-4/12'>
				<div class="fcc w-5/12"><img class="rounded-full" alt="hero" src="https://dummyimage.com/600x600"></div>
				<div>Клиентам</div>
			</a>
			<a href='/' class='bgw p-card fccc sm:w-3/12 w-4/12'>
				<div class="fcc w-5/12"><img class="rounded-full" alt="hero" src="https://dummyimage.com/600x600"></div>
				Партнёрам
			</a>
			<a href='/' class='bgw p-card fccc sm:w-3/12 w-4/12'>
				<div class="fcc w-5/12"><img class="rounded-full" alt="hero" src="https://dummyimage.com/600x600"></div>
				О компании
			</a>
		</div>

		<h2 class="text-3xl lh mt-3 text-center">Часто задаваемые вопросы</h2>
		<div class="column max-w-5xl w-full sm:w-11/12 mx-auto gap-4">
			<AccordionItem header="Стоимость услуг" body="Бесплатно, все подробности уточняйте у менеджера. "/>
			<AccordionItem header="Как происходит взаимосвязь с покупателем?" body="Бесплатно, все подробности уточняйте у менеджера. "/>
			<AccordionItem header="Как происходит взаимосвязь с покупателем?" body="Гость может с Вами связаться через чат для уточнения вопросов, а также наши менеджеры связываются с покупателем по указанному номеру телефона, для подтверждения заказа и сообщают вам о поступлении заказа."/>
			<AccordionItem header="Стоимость услуг" body="Бесплатно, все подробности уточняйте у менеджера. "/>
			<AccordionItem header="Как происходит взаимосвязь с покупателем?" body="Бесплатно, все подробности уточняйте у менеджера. "/>
			<AccordionItem header="Стоимость услуг" body="Бесплатно, все подробности уточняйте у менеджера. "/>
			<AccordionItem header="Как происходит взаимосвязь с покупателем?" body="Бесплатно, все подробности уточняйте у менеджера. "/>
			<AccordionItem header="Как происходит взаимосвязь с покупателем?" body="Бесплатно, все подробности уточняйте у менеджера. "/>
		</div>
	</div>
</main>