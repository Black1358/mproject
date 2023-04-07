<script lang="ts">
    import {fly} from 'svelte/transition';
    import {backOut} from 'svelte/easing';
    import handmade from "$lib/resources/budges/handmade.svg";
    import saleIcon from "$lib/resources/budges/sale-icon.svg";
    import saleHook from "$lib/resources/budges/sale-hook.svg";
    import cash from "$lib/resources/budges/kesha.svg";
    import toast from "svelte-french-toast";
    let duration = 300;
    export let product;
    let cashBalls = Math.round(product.price * 0.02);
    function addCart(product) {
        fetch('/api/cart/add', {method: "POST", headers: {'Content-Type': 'application/json'}, body: JSON.stringify( {product: product.id} )}).then(
            async response => {
                const ans = await response.json();
                if (ans.code === 200) toast.success('Добавлено в корзину', {position: "bottom-center",style: 'border-radius: 0.5rem; text-align:center; background: #2a4060; color: #fff'});
                else toast.error('Ошибка', {position: "bottom-center",style: 'border-radius: 0.5rem; text-align:center; background: #2a4060; color: #fff'});
            }
        )
    }
</script>

<li class="product-card" class:sale={product.sale} in:fly={{ y: 150, duration, easing: backOut }}>
    <a class='screen' href="/catalog/showcases/product/{product.slug}" >
        <div class='fcc'>
            {#if !product.sale}
                <div class="sale-label">
                    <img class="sale-hook" width="18" height="41" src={saleHook} role="none">
                    <img class="sale-icon" width="63" height="91" src={saleIcon} alt="Скидка">
                </div>
            {/if}
            <img class="preview" src="http://127.0.0.1:8090/api/files/products/{product.id}/{product.avatar}?thumb=250x250" alt="Превью" width='250' height='250'>
            <div class="labels">{#if product.handmade}<img src={handmade} alt="Ручная работа">{/if}</div>
            <div class="cash"><img src={cash} alt="КешАбэк">{cashBalls}</div>
        </div>
    </a>
    <div class="control">
        <div class='title'>{product.name}</div>
        <div class="flex gap-1">
            <button class="wishlist btn-icon fcc">
                <svg width="24" height="21" viewBox="0 0 24 21" xmlns="http://www.w3.org/2000/svg">
                    <path d="m5.537 0.62128c-2.104 0.32891-3.8367 1.5712-4.7903 3.4346-0.85266 1.6661-0.98333 3.7389-0.34947 5.5433 1.0572 3.0097 4.2833 6.4191 9.1825 9.7042 1.3087 0.8776 1.5671 0.9824 2.4207 0.9824 0.8051 0 1.1181-0.1166 2.158-0.8039 5.0182-3.3165 8.3652-6.8188 9.4447-9.8827 0.5086-1.4435 0.5292-3.0856 0.0572-4.564-0.8841-2.7694-3.5189-4.6096-6.3782-4.4546-1.2331 0.066824-2.2554 0.41186-3.3285 1.1234-0.5262 0.34888-1.3927 1.1429-1.7791 1.6304l-0.1741 0.21946-0.1735-0.21946c-0.3581-0.4529-1.2637-1.2868-1.7485-1.6102-0.7831-0.52231-1.528-0.84348-2.3892-1.0301-0.47342-0.1026-1.6968-0.14391-2.1522-0.072749z" clip-rule="evenodd" fill-rule="inherit"></path>
                </svg>
            </button>
            <div class="price-zone fccc f-g1 text-center">
                <div class="main-price">{product.price}<span class="currency"> ₽</span></div>
                {#if false}<div class="sale-price">{product.price}<span class="currency"> ₽</span></div>{/if}
            </div>
            <button on:click={() => addCart(product)} class="cart btn-icon fcc">
                <svg width="24" height="21" viewBox="0 0 24 21" xmlns="http://www.w3.org/2000/svg">
                    <path d="m5.537 0.62128c-2.104 0.32891-3.8367 1.5712-4.7903 3.4346-0.85266 1.6661-0.98333 3.7389-0.34947 5.5433 1.0572 3.0097 4.2833 6.4191 9.1825 9.7042 1.3087 0.8776 1.5671 0.9824 2.4207 0.9824 0.8051 0 1.1181-0.1166 2.158-0.8039 5.0182-3.3165 8.3652-6.8188 9.4447-9.8827 0.5086-1.4435 0.5292-3.0856 0.0572-4.564-0.8841-2.7694-3.5189-4.6096-6.3782-4.4546-1.2331 0.066824-2.2554 0.41186-3.3285 1.1234-0.5262 0.34888-1.3927 1.1429-1.7791 1.6304l-0.1741 0.21946-0.1735-0.21946c-0.3581-0.4529-1.2637-1.2868-1.7485-1.6102-0.7831-0.52231-1.528-0.84348-2.3892-1.0301-0.47342-0.1026-1.6968-0.14391-2.1522-0.072749z" clip-rule="evenodd" fill-rule="inherit"></path>
                </svg>
            </button>
        </div>
    </div>
</li>