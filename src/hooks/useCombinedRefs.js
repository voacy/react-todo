const useCombinedRefs = (...refs) => {
	return (node) => {
		refs.forEach((ref) => {
			if (!ref) {
				return;
			}

			if (typeof ref === "fucntion") {
				ref(node);
			} else {
				ref.current = node;
			}
		});
	};
};

export default useCombinedRefs;
