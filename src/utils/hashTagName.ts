function hashTagName(tagName: string) {
	const hash = tagName.split('').reduce(function (a, b) {
		a = (a << 5) - a + b.charCodeAt(0);
		return a & a;
	}, 0);

	return 'c_' + Math.abs(new Date().getTime() - hash);
}

export default hashTagName;
