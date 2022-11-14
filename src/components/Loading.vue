<template>
	<span class="l" style="--i: 1">L</span>
	<span class="o" style="--i: 2">o</span>
	<span class="a" style="--i: 3">a</span>
	<span class="d" style="--i: 4">d</span>
	<span class="i" style="--i: 5">i</span>
	<span class="n" style="--i: 6">n</span>
	<span class="g" style="--i: 7">g</span>
	<span class="dot" style="--i: 8">.</span>
	<span class="dot" style="--i: 9">.</span>
	<span class="dot" style="--i: 10">.</span>
</template>
<script lang="ts">
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
	name: 'loading'
});
</script>
<style lang="css" scoped>
span {
	position: relative;
	display: inline-block;
	font-size: 80px;
	/*   if you want only one color then you uncomment this  */
	/*   color: var(--color); */
	text-transform: uppercase;
	animation: flip 2s infinite;
	animation-delay: calc(0.2s * var(--i));
}
.l {
	color: #ff9933;
}
.o {
	color: #ff9933;
}
.a {
	color: #ffffff;
}
.d {
	color: #000080;
}
.i {
	color: #ffffff;
}
.n {
	color: #138808;
}
.g {
	color: #138808;
}
.dot {
	color: #fff;
}

@keyframes flip {
	0%,
	80% {
		transform: rotateY(360deg);
	}
}
</style>
