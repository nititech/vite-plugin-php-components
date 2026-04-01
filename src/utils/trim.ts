function trim(input: string, chars: string, position: 'start' | 'end' | 'both' = 'both'): string {
	if (!input || !chars) {
		return input;
	}

	let out = input.trim();
	const escapedChars = RegExp.escape(chars);

	if (position === 'start' || position === 'both') {
		out = out.replace(new RegExp(`^[${escapedChars}]+`, 'gs'), '');
	}
	if (position === 'end' || position === 'both') {
		out = out.replace(new RegExp(`[${escapedChars}]+$`, 'gs'), '');
	}

	return out;
}

export default trim;
