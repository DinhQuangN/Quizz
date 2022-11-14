<template>
	<main
		class="flex h-screen items-center justify-center bg-gray-100"
		v-if="!loading"
	>
		<QuizCompleteOverlay
			v-if="endOfQuiz"
			:percent="percentageScore"
			@restartQuiz="onQuizStart"
		/>
		<!-- quiz container -->
		<div
			class="overflow-hidden bg-white flex-none container relative shadow-lg rounded-lg px-12 py-6"
		>
			<img
				src="@/assets/images/abstract.svg"
				alt=""
				class="absolute -top-10 left-0 object-none"
			/>
			<!-- contents -->
			<div class="relative z-20">
				<!-- score container -->
				<div class="text-right text-gray-800">
					<p class="text-sm leading-3">Score</p>
					<p class="font-bold">{{ percentageScore }}</p>
				</div>
				<!-- timer container -->
				<div class="bg-white shadow-lg p-1 rounded-full w-full h-5 mt-4">
					<div
						class="bg-blue-700 rounded-full h-full"
						:style="`width:${timer}%`"
					></div>
				</div>
				<!-- question container -->
				<div
					class="rounded-lg bg-gray-100 p-2 neumorph-1 text-center font-bold text-gray-800 mt-8"
				>
					<div class="bg-white p-5">{{ currentQuestion.question }}</div>
				</div>
				<!-- options container -->
				<div class="mt-8">
					<!-- option container -->
					<div v-for="(choice, key) in currentQuestion.choices" :key="key">
						<div
							class="neumorph-1 option-default bg-gray-100 p-2 rounded-lg mb-3 relative"
							:ref="optionChosen"
							@click="onOptionClicked(choice, key)"
						>
							<div
								class="bg-blue-700 p-1 transform rotate-45 rounded-md h-10 w-10 text-white font-bold absolute right-0 top-0 shadow-md"
							>
								<p class="transform -rotate-45">+10</p>
							</div>
							<div class="rounded-lg font-bold flex p-2">
								<!-- option ID -->
								<div class="p-3 rounded-lg">{{ toLetters(key + 1) }}</div>
								<!-- option name -->
								<div class="flex items-center pl-6">{{ choice }}</div>
							</div>
						</div>
					</div>
				</div>
				<!-- progress indicator container -->
				<div class="mt-8 text-center">
					<div class="h-1 w-12 bg-gray-800 rounded-full mx-auto"></div>
					<p class="font-bold text-gray-800">
						{{ questionCounter }}/{{ questions.length }}
					</p>
				</div>
			</div>
		</div>
		<!-- <button @click="loadQuestion">Click</button> -->
	</main>
	<div v-else class="flex items-center justify-center h-screen bg-[#111]">
		<Loading />
	</div>
</template>
<script lang="ts">
import Loading from '@/components/Loading.vue';
import QuizCompleteOverlay from '@/components/QuizCompleteOverlay.vue';
import { IData, IQuestion } from '@/utils/typeScript';
import { toLetters } from '@/utils/vaild';
import { defineComponent } from '@vue/runtime-core';
import axios from 'axios';
let itemsRef: any[] = [];
export default defineComponent({
	name: 'home',
	data() {
		return {
			questions: [] as IQuestion[],
			loading: true as boolean,
			canClick: true as boolean,
			percentageScore: 0 as number,
			questionCounter: 0 as number,
			endOfQuiz: false as boolean,
			currentQuestion: {
				question: '',
				answer: '',
				choices: []
			} as IQuestion,
			timer: 100 as number
		};
	},
	created() {
		this.fetchQuestions();
	},
	methods: {
		async fetchQuestions() {
			await axios
				.get('https://opentdb.com/api.php?amount=50')
				.then(res => {
					const newQuestions = res.data.results.map((item: IData) => {
						const arrangedQuestion = {
							question: item.question,
							answer: '' as string,
							choices: [] as string[]
						};
						const choices = item.incorrect_answers;
						arrangedQuestion.answer = item.correct_answer;
						choices.splice(
							Math.floor(Math.random() * 4 + 1) - 1,
							0,
							item.correct_answer
						);
						arrangedQuestion.choices = choices;
						return arrangedQuestion;
					});
					this.questions = newQuestions;
					this.loading = false;
					this.loadQuestion();
					this.countDownTimer();
				})
				.catch(error => {
					console.log(error);
				});
		},
		toLetters(num: number) {
			return toLetters(num);
		},
		loadQuestion() {
			if (this.questions.length > this.questionCounter) {
				this.timer = 100;
				this.currentQuestion = this.questions[this.questionCounter];
				this.canClick = true;
				this.questionCounter++;
			}
		},

		optionChosen(e: any) {
			if (e) return itemsRef.push(e);
		},
		clearSelected(key: number) {
			setTimeout(() => {
				itemsRef[key].classList.remove('option-correct');
				itemsRef[key].classList.remove('option-wrong');
				itemsRef[key].classList.add('option-default');
				this.loadQuestion();
			}, 1000);
		},
		onOptionClicked(choice: string, key: number) {
			if (this.canClick) {
				if (this.currentQuestion.answer === choice) {
					this.percentageScore += 10;
					itemsRef[key].classList.add('option-correct');
					itemsRef[key].classList.remove('option-default');
				} else {
					itemsRef[key].classList.add('option-wrong');
					itemsRef[key].classList.remove('option-default');
				}
			}
			// this.timer = 100;
			this.canClick = false;
			this.clearSelected(key);
		},
		countDownTimer() {
			let interVal = setInterval(() => {
				if (this.timer > 0) {
					this.timer--;
				} else {
					this.onQuizEnd();
					clearInterval(interVal);
				}
			}, 150);
		},
		onQuizStart() {
			this.canClick = true;
			this.timer = 100;
			(this.endOfQuiz = false), (this.questionCounter = 0);
			(this.currentQuestion = {
				question: '',
				answer: '',
				choices: []
			}),
				(this.percentageScore = 0);
			this.questions = [];
			this.fetchQuestions();
		},
		onQuizEnd() {
			this.timer = 0;
			this.percentageScore = (this.percentageScore / 100) * 100;
			this.endOfQuiz = true;
		}
	},
	mounted() {
		this.timer === 0;
	},
	watch: {},
	components: { Loading, QuizCompleteOverlay }
});
</script>
<style lang="css" scoped>
.container {
	max-width: 400px;
	border-radius: 25px;
}
.neumorph-1 {
	box-shadow: 6px 6px 18px rgba(0, 0, 0, 0.09), -6px -6px 18px #fff;
}
</style>
