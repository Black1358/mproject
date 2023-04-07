<script lang="ts">
	import PocketBase from 'pocketbase';
	import moment from 'moment';
	import {fly} from 'svelte/transition';
	import {backOut} from 'svelte/easing';
	import {page} from "$app/stores";
	import {onDestroy, onMount} from "svelte";
	const pb = new PocketBase('http://127.0.0.1:8090');
	let duration = $page.data.animation || 330;
	let chalistid = $page.data.chalistid || "";
	let chatList = [];
	let searchChat = "";
	let windowWidth;
	onMount(async () => {
		chatList = await pb.collection(chalistid).getFullList({sort: '-updated'});
		await pb.collection(chalistid).subscribe('*', async ({action, record}) => {
			console.log(action);
			console.log(record);
			if (action === 'update') {
				let temp = chatList;
				for (let i = 0; i < temp.length; i++) {
					if (temp[i].id === record.id) {
						temp.splice(i, 1);
						break;
					}
				}
				chatList = [record, ...temp]
			}
			if (action === 'create') {chatList = [record, ...chatList]}
		})
	})
	onDestroy(async () => {await pb.collection('chatlistnayf5o13aijbxxd').unsubscribe()})
</script>

<svelte:window bind:innerWidth={windowWidth}/>

{#if windowWidth === undefined}
	<main class="full">
		<div class='s-center'>Загрузка...</div>
	</main>
{:else}
	<main class="full gap-3">
		{#if windowWidth < 690 && $page.url.pathname === "/cabinet/messages" || windowWidth >= 690}
				<div class="chat-list column bgw f-s0" in:fly={{ x: -150, duration, easing: backOut }}>
					<div class="search-header pd">
						<form class="fsbc">
							<svg class="f-g0 f-s0" width="16" height="16" viewBox="0 0 24 24"  fill="none" xmlns="http://www.w3.org/2000/svg" >
								<path d="M18.031 16.617l4.283 4.282-1.415 1.415-4.282-4.283A8.96 8.96 0 0 1 11 20c-4.968 0-9-4.032-9-9s4.032-9 9-9 9 4.032 9 9a8.96 8.96 0 0 1-1.969 5.617zm-2.006-.742A6.977 6.977 0 0 0 18 11c0-3.868-3.133-7-7-7-3.868 0-7 3.132-7 7 0 3.867 3.132 7 7 7a6.977 6.977 0 0 0 4.875-1.975l.15-.15z"/>
							</svg>
							<input
								class="form-control me-sm-2 border-0 box-shadow-none"
								type="search"
								placeholder="Поиск..."
								aria-label="Search"
								bind:value={searchChat}
							/>
							<svg class="f-g0 f-s0"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
								<path d="M17 3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h4V1h2v2h6V1h2v2zm3 8H4v8h16v-8zm-5-6H9v2H7V5H4v4h16V5h-3v2h-2V5zm-9 8h2v2H6v-2zm5 0h2v2h-2v-2zm5 0h2v2h-2v-2z"/>
							</svg>
						</form>
					</div>
					<div class="search-tab pd-l">
						<ul class="nav flex ap-tab-main g-sb border-bottom chat-nav-js">
							<li class="nav-item me-0 w-50 t-center">
								<a href={$page.url.pathname + "?type=all"} class="nav-link" class:active={$page.url.searchParams.get("type") === "all"}>
									Все чаты
								</a>
							</li>
							<li class="nav-item me-0 w-50 t-center">
								<a href={$page.url.pathname + "?type=favourites"} class="nav-link" class:active={$page.url.searchParams.get("type") === "favourites"}>
									Избранные
								</a>
							</li>
						</ul>
					</div>
					<div class="search-body w-100 f-g1 pd-l">
						<ul class="user-list">
							{#each chatList as chat (chat.id)}
								<li><a href={"/cabinet/messages/" + chat.chat} class="user-list-item flex">
										<div class="fcc f-s0 f-g0 ava">
											<svg width="35" height="35" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M29 14.5C29 6.49187 22.5081 0 14.5 0C6.49187 0 0 6.49187 0 14.5C0 22.5081 6.49187 29 14.5 29C22.5081 29 29 22.5081 29 14.5Z" fill="#f0f4fe" class="s-FEI_BMkMi4LI"></path>
												<path d="M19.2366 15.7889C19.775 15.7889 20.2913 15.9925 20.672 16.3551C21.0528 16.7177 21.2666 17.2095 21.2666 17.7222V18.183C21.2666 20.4882 18.4178 22.2333 14.4999 22.2333C10.582 22.2333 7.73328 20.5791 7.73328 18.183V17.7222C7.73328 17.2095 7.94715 16.7177 8.32785 16.3551C8.70855 15.9925 9.22489 15.7889 9.76328 15.7889H19.2366ZM14.4999 6.76666C15.0332 6.76666 15.5611 6.86667 16.0537 7.06099C16.5462 7.25531 16.9938 7.54013 17.3708 7.89918C17.7478 8.25824 18.0468 8.68449 18.2509 9.15362C18.455 9.62275 18.5599 10.1255 18.5599 10.6333C18.5599 11.1411 18.455 11.6439 18.2509 12.113C18.0468 12.5821 17.7478 13.0084 17.3708 13.3674C16.9938 13.7266 16.5462 14.0113 16.0537 14.2056C15.5611 14.3999 15.0332 14.5 14.4999 14.5C13.4232 14.5 12.3905 14.0926 11.6291 13.3674C10.8677 12.6424 10.4399 11.6589 10.4399 10.6333C10.4399 9.60782 10.8677 8.62433 11.6291 7.89918C12.3905 7.17404 13.4232 6.76666 14.4999 6.76666Z" fill="#0D264A"></path>
											</svg>
										</div>
										<div class="user-list-body f-g1 column">
											<div class="flex gap3">
												<div class="users-list-title t-cut f-g1">{chat.name}</div>
												<div class="time f-s0 f-g0">{moment(chat.updated).format('HH:mm')}</div>
											</div>
											<div class="fsbc gap3">
												<div class="last_message t-cut f-g1">{chat.text}</div>
												<div class="total-message fcc f-s0 f-g0">

												</div>
											</div>
										</div>
									</a>
								</li>
							{/each}
						</ul>
					</div>
				</div>
		{/if}
		{#if windowWidth < 690 && $page.url.pathname !== "/cabinet/messages" || windowWidth >= 690}
			<div class="f-g1 fcc max-w-full">
				<slot />
			</div>
		{/if}
	</main>
{/if}

<style lang="postcss">
  @import "/src/lib/adreano/scss/varibles.scss";
  main{@apply items-stretch p-0}
  :root {
    --w:#fff;
    --b:#305da0;

    --main: #0d264a;
    --main-el: #3d516e;
    --alt-main: #f0f4fe;

    --accent: #e2b59c;
    --accent-el: #8B5D42;
    --alt-accent: #f9f0eb;

    --hint:#f9f9f9;
    --txt-color: #313131;
    --txt-accent: #8B5D42;
  }
  :root{--bg-light:#747474;--color-light:#747474;--color-primary:var(--main);}

  /* Поиск */
  .chat-list{font-family: Calibri, sans-serif;padding:7px}
  @media (min-width: 690px){.chat-list{width:250px;border:1px #eee solid;}}
	@media (max-width: 690px){
			.chat-list{width:100%}
			@media (orientation:portrait) {
					main{width:100vw;max-width:unset;height:100vh;
              margin: calc(-1 * var(--card)) 0 calc(-1 * (var(--sidebar) + var(--card))) calc(-1 * var(--card));
              padding-bottom:calc(var(--sidebar) + var(--card));
							background: white;
							overflow: hidden;
					}
      }
	}
	
  .chat-list .search-header{height:68px;padding-right:0}
  .chat-list form{background-color:var(--hint);border-radius:15px;height:44px;padding:0 14px 0 12px}
  .chat-list form svg{width:16px;height:16px;fill:var(--bg-light)}
  .chat-list form input{background-color:var(--hint);padding:8px 13px;font-size:14px;line-height:25px;font-weight:400;}
  .chat-list form input:focus{background-color:var(--hint)}

  /* Табы */
  .ap-tab-main .nav-link{position:relative;font-size:13px;line-height:1.5;font-weight:400;padding:0 0 7px;cursor:pointer;color:var(--color-light)}
  .ap-tab-main .nav-link.active{font-weight:500}
  .ap-tab-main .nav-link:after{position:absolute;left:0;bottom:1px;width:100%;height:2px;border-radius:6px;content:"";opacity:0;visibility:hidden;background-color:var(--color-primary);z-index:1}
  .ap-tab-main .nav-link.active{color:var(--color-primary);font-weight:500}
  .ap-tab-main .nav-link.active:after{opacity:1;visibility:visible}

  /* Список чатов */
  .search-body{overflow:hidden auto}

  /* Чат-item */
  .user-list-item{
    border-bottom: 1px var(--alt-main) solid;
    padding: 9px 4px;
    color: black;
  }
  .ava{margin-right:7px}
  .ava svg{border-radius: 50%;border: 1px var(--main) solid}
  .user-list-body {width: calc(100% - 39px);}
  .user-list-item .users-list-title {
    font-size: 15px;
    line-height: 17px;
    font-weight: 700;
    min-width: 0;
  }
  .user-list-item .time {
    color: #2a4060;
    font-size: 13px;
    line-height: 18px;
  }
  .user-list-item .last_message{font-size: 14px;}
  .user-list-item:focus{text-decoration: none}

  .chat-type-text__write input::placeholder {
    font-size:14px;
    line-height:1.4285714286;
    font-weight:400;
    color:var(--color-light)
  }
  .chat-type-text__write a img,
  .chat-type-text__write a svg {
    color:#ADB4D2;
    width:24px;
    height:24px
  }
  .chat-type-text__write a input {
    padding:8px 0
  }

  .chat-type-text__btn img,
  .chat-type-text__btn svg {
    width:18px;
    height:18px
  }
  .chat-type-text__btn button:last-child {
    box-shadow:0 8px 13px rgba(95, 99, 242, 0.2)
  }
</style>