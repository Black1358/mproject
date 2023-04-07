<script lang="ts">
	import ProductCard from '$lib/ui/components/ProductCard.svelte';
	import toast from "svelte-french-toast";
	import {onMount} from 'svelte';
	import {fly} from 'svelte/transition';
	import {backOut} from 'svelte/easing';
	import {page} from "$app/stores";
	$: product = JSON.parse($page.data.product);
	$: recommends = JSON.parse($page.data.recommends);
	let vendorType;
	$: if (product.expand.vendor.type === "master") {vendorType = "Мастерская"} else if (product.expand.vendor.type === "shop") {vendorType = "Магазин"}
	let count = 1;
	const inc = () => {count++}
	const dec = () => {count > 1 ? count-- : null}
	function addCart() {fetch('/api/cart/add', {method: "POST",headers: {'Content-Type': 'application/json'},body: JSON.stringify({product: product.id, count}) }).then(
			async response => {
				const ans = await response.json();
				if (ans.code === 200) {
					toast.success('Успешно добавлено', {
						position: "bottom-center", style: 'border-radius: 0.5rem; text-align:center; background: #2a4060; color: #fff'});
				} else toast.error('Произошла ошибка', {
						position: "bottom-center",style: 'border-radius: 0.5rem; text-align:center; background: #2a4060; color: #fff'});
			}
		)
	}
	function addFav() {fetch('/api/cart/add', {method: "POST",headers: {'Content-Type': 'application/json'},body: JSON.stringify({product: product.id, count}) }).then(
		async response => {
			const ans = await response.json();
			if (ans.code === 200) {
				toast.success('Успешно добавлено', {
					position: "bottom-center", style: 'border-radius: 0.5rem; text-align:center; background: #2a4060; color: #fff'});
			} else toast.error('Произошла ошибка', {
				position: "bottom-center",style: 'border-radius: 0.5rem; text-align:center; background: #2a4060; color: #fff'});
		}
	)
	}
	let scale = 2;
	let currentImageIndex = 0;
	let autoSlideTimeout;
	let fullScreenImage = null;
	let isFading = false;
	let imageContainer;
	let images = [
		//Массив с изображениями
		'http://placeimg.com/200/200/people',
		"http://127.0.0.1:8090/api/files/products/apjpqwldyachwh2/qplwtpsw_c_bzWsmX9YKw.jpg",
		'http://placeimg.com/150/150/people',
		'http://placeimg.com/175/175/people',
		'http://placeimg.com/185/185/people',
	];
	const nextImage = () => {currentImageIndex = (currentImageIndex + 1) % images.length;resetAutoSlide()};
	const resetAutoSlide = () => {
		clearTimeout(autoSlideTimeout);
		autoSlideTimeout = setTimeout(nextImage,5000);
	}
	const switchFullScreenImage = (direction) => {
		if (isFading) return;
		let currentIndex = images.indexOf(fullScreenImage);
		const nextIndex = (currentIndex + (direction === "next" ? 1 : -1) + images.length) % images.length;
		fade(() => {fullScreenImage = images[nextIndex]});
	};
	const fade = (callback) => {
		isFading = true;
		setTimeout(() => {
			callback();
			setTimeout(() => (isFading = false), 175);
		}, 175);
	};
	const handleMouseMove = (event) => {
		clearTimeout(autoSlideTimeout);
		const { clientX, clientY, currentTarget } = event;
		const activeImage = currentTarget.querySelectorAll('img')[currentImageIndex];
		const mouseX = clientX - currentTarget.offsetLeft;
		const mouseY = clientY - currentTarget.offsetTop;
		const lensX = mouseX / currentTarget.offsetWidth * activeImage.offsetWidth;
		const lensY = mouseY / currentTarget.offsetHeight * activeImage.offsetHeight;
		activeImage.style.transform = `scale(${scale})`;
		activeImage.style.transformOrigin = `${lensX}px ${lensY}px`;
	}
	const scaleHandle = (event) => {
		event.preventDefault();
		const activeImage = event.currentTarget.querySelectorAll('img')[currentImageIndex];
		if (event.deltaY < 0) scale = Math.min(Math.max(scale += 0.5, 1.5), 8);
		else scale = Math.min(Math.max(scale -= 1, 1.25), 8);
		activeImage.style.transform = `scale(${scale})`;
	}
	const handleMouseLeave = (event) => {
		scale = 2;
		const { clientX, clientY, currentTarget } = event;
		const activeImage = currentTarget.querySelectorAll('img')[currentImageIndex];
		const mouseX = clientX - currentTarget.offsetLeft;
		const mouseY = clientY - currentTarget.offsetTop;
		const lensX = mouseX / currentTarget.offsetWidth * activeImage.offsetWidth;
		const lensY = mouseY / currentTarget.offsetHeight * activeImage.offsetHeight;
		activeImage.style.transformOrigin = `${lensX}px ${lensY}px`;
		activeImage.style.transform = 'scale(1)';
		resetAutoSlide();
	}
	onMount(() => {resetAutoSlide();return () => {clearTimeout(autoSlideTimeout)}});
	$: fullScreenImage !== null ? clearTimeout(autoSlideTimeout) : resetAutoSlide();
</script>

<svelte:head>
	<title>{$page.data.metaTitle}</title>
	<meta name="description" content={$page.data.metaDesc} />
</svelte:head>

<main class="header fcc" in:fly={{ x: 150, duration: $page.data.animation, easing: backOut }}>
	<div class='column max-w-full' style='max-width: 1000px'>
		<div class='flex g-card'>
			<div class="gallery column gap-2 p-card bgw bor">
				<div class="image-container rounded-lg" role='button' tabindex={fullScreenImage === null ? "0" : "-1"}
						 bind:this={imageContainer} on:wheel={scaleHandle}
						 on:mousemove={handleMouseMove} on:mouseleave={handleMouseLeave}
						 on:click={() => {fullScreenImage = images[currentImageIndex]}}
						 on:keydown={(e) => {e.key === 'Enter' && (fullScreenImage = images[currentImageIndex])}} >
					{#each images as image,index (image)}
						<img src={image} alt="" style={`left:${index === currentImageIndex ? '0' : index < currentImageIndex ? '-100%' : '100%'}`}/>
					{/each}
				</div>
				{#if images.length > 1}
				<div class="thumbnails gap-2 flex g-center">
						{#each images as image,index (image)}
								<img class="thumbnail rounded-lg" alt="" role='button' tabindex={fullScreenImage === null ? "0" : "-1"} src={image}
								 on:click={() => {currentImageIndex = index; resetAutoSlide() }}
								 on:keydown={(e) => {e.key === 'Enter' && (currentImageIndex = index); resetAutoSlide() }}
								 on:focusin={() => {currentImageIndex = index; resetAutoSlide() }} />
						{/each}
					</div>
				{/if}
			</div>
			<div class='details column g-sb gap-0.5 p-card bgw bor'>
				<div>
					<h1 class='text-2xl font-bold'>{product.name}</h1>
					<p class='text-center'>{vendorType}: <a href="/partner/{product.expand.vendor.slug}" tabindex={fullScreenImage === null ? "0" : "-1"}>{product.expand.vendor.name}</a></p>
					<p>{product.desc}</p>
				</div>
				<div class='flex'>
					<button class='btn' type="button" on:click={addFav} tabindex={fullScreenImage === null ? "0" : "-1"}>К</button>
					<div>
						<button class='btn' type="button" on:click={dec} tabindex={fullScreenImage === null ? "0" : "-1"}>-</button>
						<input type="number" bind:value={count} tabindex={fullScreenImage === null ? "0" : "-1"}>
						<button class='btn' type="button" on:click={inc} tabindex={fullScreenImage === null ? "0" : "-1"}>+</button>
					</div>
					<div>{product.price * count}</div>
					<button class='btn' type="button" on:click={addCart} tabindex={fullScreenImage === null ? "0" : "-1"}>К</button>
				</div>
			</div>
		</div>
		<h2>Продукты</h2>
		<ul class='product-list'>
			{#each recommends as product}
				<ProductCard {product} />
			{/each}
		</ul>
	</div>
	{#if fullScreenImage !== null }
		<div class="full-screen-image-container">
			<button class="prev" on:click={() => switchFullScreenImage("prev")} aria-label="Предыдущее изображение">Prev</button>
			<img src={fullScreenImage} alt="" class={isFading ? 'fade' : ''}/>
			<button class="next" on:click={() => switchFullScreenImage("next")} aria-label="Следующее изображение">Next</button>
			<button class="close" on:click={() => {fullScreenImage = null}} aria-label="Закрыть полноэкранный режим">X</button>
		</div>
	{/if}
</main>

<style>
    .image-container {
        position: relative;
        overflow:hidden;
        width:350px; height: 350px
    }
    .image-container img {
        width:100%;
        position:absolute;
        left:0;
        top:0;
        transition:transform .5s ease-in-out, left  .5s ease-in-out;
    }
    .image-container {
        position: relative;
        overflow:hidden;
        width:350px; height: 350px
    }
    .image-container img {
        width:100%;
        position:absolute;
        left:0;
        top:0;
        transition:transform .5s ease-in-out, left  .5s ease-in-out;
    }
		.thumbnail {width:25%}

    .next, .prev{
        position:absolute;
        top:50%;
        transform:translateY(-50%);
        z-index:1
    }
    .next{
        right:-30px
    }
    .prev{
        left:-30px
    }
    .full-screen-image-container {
        position: absolute;
        top: 16px;
        left: 16px;
        width: calc(100% - 32px);
        height: calc(100% - 32px);
        background-color: white;
        display: flex;
        z-index: 2;
        border-radius: 8px;
        padding: 8px;
    }
    .full-screen-image-container img{
        max-width:100%;
        max-height:100%;
        margin:auto;
        border-radius:8px;
        transition:opacity .175s ease-in-out
    }
    .fade{opacity:0}
    .close {
        position: absolute;
        top: 8px;
        left: calc(100% - 24px);
        cursor:pointer;
        font-size :24px;
        font-weight:bold;
        color:black;
        background-color:white;
        border-radius :50%;
        padding :4px;
        width :24px;
        height :24px;
        text-align:center;
        line-height :24px;
        z-index :3
    }
</style>