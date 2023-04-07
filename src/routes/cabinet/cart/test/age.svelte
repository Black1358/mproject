<script>
	import moment from 'moment';

	let products = [
		{
			id: 1,
			name: 'Product 1',
			image: 'https://via.placeholder.com/50'
		},
		{
			id: 2,
			name: 'Product 2',
			image: 'https://via.placeholder.com/50'
		},
		{
			id: 3,
			name: 'Product 3',
			image: 'https://via.placeholder.com/50'
		},
		{
			id: 4,
			name: 'Product 4',
			image: 'https://via.placeholder.com/50'
		},
		{
			id: 5,
			name: 'Product 5',
			image: 'https://via.placeholder.com/50'
		}
	];

	let deliverySchedule = Array.from({ length: 7 * 24 }, () => ({ products: [] }));

	function dragStart(e, product) {
		e.dataTransfer.setData('text/plain', JSON.stringify(product));
	}

	function drop(e, day, hour) {
		e.preventDefault();
		const product = JSON.parse(e.dataTransfer.getData('text/plain'));
		const cellIndex = day * 24 + hour;
		deliverySchedule[cellIndex].products.push(product);
	}

	function dragOver(e, day, hour) {
		e.preventDefault();
		e.target.style.background = '#f8f9fa';
	}

	function dragLeave(e) {
		e.target.style.background = '';
	}
</script>

<style>
    .schedule {
        border-collapse: collapse;
        width: 100%;
    }

    .schedule th,
    .schedule td {
        border: 1px solid #dee2e6;
        padding: 0.5rem;
        text-align: center;
    }

    .schedule th {
        background-color: #e9ecef;
    }

    .product {
        display: inline-block;
        width: 48px;
        height: 48px;
        background-color: #f8f9fa;
        border: 1px solid #dee2e6;
        padding: 0.25rem;
        border-radius: 4px;
        cursor: grab;
    }

    .product img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 4px;
    }
</style>

<h3>Товары</h3>
<div>
	{#each products as product}
		<div class="product" on:dragstart={(e) => dragStart(e, product)} draggable="true">
			<img src="{product.image}" alt="{product.name}" />
		</div>
	{/each}
</div>

<h3>Расписание доставки</h3>
<table class="schedule">
	<thead>
	<tr>
		<th>Время / День</th>
		{#each Array.from({ length: 24 }) as _, hour}
			<th>{hour}:00</th>
		{/each}
	</tr>
	</thead>
	<tbody>
	{#each Array.from({ length: 7 }) as _, day}
		<tr>
			<th>{moment().add(day, 'days').format('ddd, MMM Do')}</th>
		</tr>
	{/each}
	</tbody>
</table>
