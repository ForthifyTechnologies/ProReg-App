export default function capitalize(str: string): string {
	return str
		.replace(/\s{2,}/g, " ")
		.trim()
		.toLowerCase()
		.split(" ")
		.map((word, index, words) => {
			if (index === words.length - 1 && isRomanNumeral(word)) {
				return word.toUpperCase();
			}
			return word[0].toUpperCase() + word.substring(1);
		})
		.join(" ");
}

function isRomanNumeral(word: string): boolean {
	const romanNumerals: { [key: string]: number } = {
		I: 1,
		V: 5,
		X: 10,
		L: 50,
		C: 100,
		D: 500,
		M: 1000,
	};

	let sum = 0;
	let prevValue = 0;

	for (let i = word.length - 1; i >= 0; i--) {
		const currentValue = romanNumerals[word[i].toUpperCase()];

		if (currentValue === undefined) {
			return false; // Invalid character
		}

		if (currentValue < prevValue) {
			sum -= currentValue;
		} else {
			sum += currentValue;
			prevValue = currentValue;
		}
	}

	return sum > 0;
}
