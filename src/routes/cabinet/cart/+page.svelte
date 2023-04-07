<script lang="ts">
	import toast from 'svelte-french-toast'
	import { fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { page } from "$app/stores";
	let cart = JSON.parse($page.data.cart) || [];
	function deleteItem(cartItem) {
		fetch('/api/cart/delete', {method: "POST",headers: {'Content-Type': 'application/json'},body: JSON.stringify({cartItem: cartItem.id}) }).then(
			async response => {
				const ans = await response.json();
				if (ans.code === 200) {
					toast.success('Успешно удалено', {
						position: "bottom-center",
						style: 'border-radius: 0.5rem; text-align:center; background: #2a4060; color: #fff'
					});
					cart = cart.filter(t => t !== cartItem);
				} else {
					toast.error('Произошла ошибка', {
						position: "bottom-center",
						style: 'border-radius: 0.5rem; text-align:center; background: #2a4060; color: #fff'
					})
				}
			}
		)
	}

	function getTotal() {
		return cart.reduce((total, item) => total + item.expand.product.price, 0);
	}
</script>

<svelte:head>
	<title>{$page.data.metaTitle}</title>
	<meta name="description" content={$page.data.metaDesc} />
</svelte:head>

<main class="classic p-0" in:fly={{ x: 150, duration: $page.data.animation, easing: backOut }}>
	<div class="column gap-3 w-full">
		{#if cart.length === 0}
			<div class='f-g1 fccc'>
				<p>У вас нет ещё товаров в корзине!</p>
			</div>
		{:else}
			{#each cart as item}
				<div class="fsbc gap-3 bgw rounded-lg p-3" out:fly={{ x: -150, duration: 150, easing: backOut }}>
					<img class='w-16 h-16 rounded-lg s-center' src="http://127.0.0.1:8090/api/files/products/{item.expand.product.id}/{item.expand.product.avatar}?thumb=250x250" alt="Превью">
					<div class='column gap-1 f-g1'>
						<h4 class='text-lg font-bold'>{item.expand.product.name}</h4>
						<p class="text-gray-500">{item.expand.product.price}</p>
					</div>
					<div class='fcc'>
						<button on:click={() => deleteItem(item)}><svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M3 6H5M5 6H21M5 6V20C5 20.5304 5.21071 21.0391 5.58579 21.4142C5.96086 21.7893 6.46957 22 7 22H17C17.5304 22 18.0391 21.7893 18.4142 21.4142C18.7893 21.0391 19 20.5304 19 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M10 11V17M14 11V17" stroke="#0D264A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg></button>
					</div>
				</div>
			{/each}
			<div class="fsbc gap-3 bgw rounded-lg p-3 mt-4">
				<div class="text-lg font-bold">Итого:</div>
				<div class="text-lg font-bold">{getTotal()} руб.</div>
			</div>
			<div class="mt-4">
				<button class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" on:click={() => {}}>Оформить заказ</button>
			</div>
		{/if}
	</div>
</main>