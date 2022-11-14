export interface IData {
	category: string;
	correct_answer: string;
	difficulty: string;
	incorrect_answers: string[];
	question: string;
	type: string;
}
export interface IQuestion {
	choices: string[];
	question: string;
	answer: string;
}
