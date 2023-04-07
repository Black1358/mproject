<!--suppress TypeScriptUnresolvedFunction -->
<script lang="ts">
	import { Link, Cube, Loader } from '$lib/ui/icons';
	import { InputField } from '$lib/ui/kit';
	import { fly } from 'svelte/transition';
	import { backOut } from 'svelte/easing';
	import { page } from '$app/stores';
	import { err } from '$lib/internal/toasts';
	import { tick } from 'svelte';
	import CategoryTree from '$lib/ui/components/CategoryTree.svelte';

	const responseData = JSON.parse($page.data.categories);
	const specifications = JSON.parse($page.data.specifications);
	const products = JSON.parse($page.data.products);

	console.log(products);
	console.log(specifications);

	let productData = {
		name: "",
		slug: "",
		desc: "",
		width: "",
		length: "",
		height: "",
		weight: ""
	}

	let loading = false;

	$: disabled = !(productData.name !== "");

	const send = async () => {
		loading = true;
		if (disabled) err();
		else {
			//const response =
			await fetch('/api/vendor/products/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify( {...productData, categories: selectedCategories } )});
		}
		loading = false;
	}

	let selectedCategories = [];
	function buildCategoryTree(categories, parentId = "") {
		return categories
			.filter((category) => category.parent === parentId)
			.map((category) => {
				return {
					...category,
					children: buildCategoryTree(categories, category.id),
				};
			});
	}
	function onSelectCategory(category) {
		if (category.children.length === 0) {
			selectedCategories = [];
			let currentCategory = category;
			while (currentCategory) {
				selectedCategories.unshift(currentCategory.id);
				currentCategory = responseData.find(
					(cat) => cat.id === currentCategory.parent
				);
			}
		}
	}
	const categories = buildCategoryTree(responseData);

	let avatar;
	import Cropper from 'cropperjs';
	import 'cropperjs/dist/cropper.css';
	import ProductSpecificationInput from '$lib/ui/components/ProductSpecificationInput.svelte';
	let avatarInput: HTMLInputElement;
	let croppingImage: HTMLImageElement;
	let cropper: Cropper | null = null;
	const createCropper = () => {
		cropper?.destroy();
		cropper = new Cropper(croppingImage, { aspectRatio: 1, viewMode: 1, autoCropArea: 1 });
	};
	const handleAvatarChange = async (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = async (e) => {
				avatar = e.target.result as string;
				await tick();
				createCropper();
			};
			reader.readAsDataURL(file);
		}
	};
</script>

<svelte:head>
	<title>{$page.data.metaTitle}</title>
	<meta name="description" content={$page.data.metaDesc} />
</svelte:head>

<main class="classic" in:fly={{ x: 150, duration: $page.data.animation, easing: backOut }}>
	<div class='page'>
		<h1>Добавление товара</h1>
		<div class="avatar-container form-item">
			<div class="avatar-edit">
				{#if avatar}
					<img
						class="avatar-image"
						src="{avatar}"
						alt="Изображения товара"
						bind:this="{croppingImage}"
					/>
				{/if}
			</div>
			<div class="avatar-change">
				<label for="avatar" class="avatar-label">Изменить аватар</label>
				<input
					type="file"
					id="avatar"
					class="avatar-input"
					accept="image/*"
					on:change="{handleAvatarChange}"
					bind:this="{avatarInput}"
				/>
			</div>
		</div>

		<div class='w-full form-item'>
			<InputField id="name" labelText="Название" placeholder="Лучший товар" bind:value={productData.name} >
				<Cube />
			</InputField>
		</div>
		<div class='w-full form-item'>
			<InputField id="slug" labelText="Ссылка" placeholder="Лучший товар" bind:value={productData.slug} >
				<Link />
			</InputField>
		</div>

		<div class="input-icon column">
			<div class='label-container fsbc'>
				<div><label>Габариты</label> <span class="text-red-500 font-bold">∗</span></div>
			</div>
			<div class='relative'>
				<div class="icon-container fcc">
					<Cube />
				</div>
				<div class='flex gap-2 input-custom-box'>
					<input bind:value={productData.width} class='f-g1' type='number' min='1'/>
					<div>X</div>
					<input bind:value={productData.length} class='f-g1' type='number' min='1'/>
					<div>X</div>
					<input bind:value={productData.height} class='f-g1' type='number' min='1'/>
					<input bind:value={productData.weight} class='f-g1' type='number' min='1'/>
				</div>
			</div>
		</div>
		<div class='w-full form-item'>
			<div class="input-icon column">
				<div class='label-container fsbc gap-1.5'>
					<div><label for="desc">Описание</label> <span class="text-red-500 font-bold">∗</span></div>
					<div><span class="error-text"></span></div>
				</div>
				<textarea bind:value={productData.desc}  id='desc' rows='5'></textarea>
			</div>
		</div>



		<ProductSpecificationInput {specifications} {selectedCategories} />

		<button type='submit' class='btn btn-secondary w-11/12 font-bold fcc gap-2' {disabled} on:click={send}>
			{#if loading}<Loader />Обработка...{:else}Продолжить{/if}
		</button>
	</div>
</main>

<style lang='postcss'>
    .input-icon .input-custom-box {
        height: 38px;
        padding: 8px 8px 8px 38px;
        width: 100%;
        -webkit-border-radius: 0.5rem;
        border-radius: 0.5rem;
        border-width: 1px;
        --tw-border-opacity: 1;
        border-color: rgb(209 213 219/var(--tw-border-opacity));
        --tw-bg-opacity: 1;
        background-color: rgb(255 255 255/var(--tw-bg-opacity));
        --tw-text-opacity: 1;
        color: rgb(55 65 81/var(--tw-text-opacity));
        outline: 2px solid transparent;
        outline-offset: 2px;
        & input {
            background: transparent;
            width: 20px;
        }
    }
    textarea {
        padding: 8px;
        width: 100%;
        -webkit-border-radius: 0.5rem;
        border-radius: 0.5rem;
        border-width: 1px;
        --tw-border-opacity: 1;
        border-color: rgb(209 213 219/var(--tw-border-opacity));
        --tw-bg-opacity: 1;
        background-color: rgb(255 255 255/var(--tw-bg-opacity));
        --tw-text-opacity: 1;
        color: rgb(55 65 81/var(--tw-text-opacity));
        outline: 2px solid transparent;
        outline-offset: 2px;
    }
</style>