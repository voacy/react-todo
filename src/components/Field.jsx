const Field = (props) => {
	const {
		className = "",
		id,
		label,
		type = "text",
		onInput,
		value,
		ref,
		error,
	} = props;

	return (
		<div className={`field ${className}`}>
			<label className="field__label" htmlFor={id}>
				{label}
			</label>
			<input
				className={`field__input ${error ? "is-invalid" : ""}`}
				id={id}
				placeholder=""
				autoComplete="off"
				type={type}
				onInput={onInput}
				ref={ref}
				value={value}
			/>
			{error && (
				<span className="field__error" title={error}>
					{error}
				</span>
			)}
		</div>
	);
};

export default Field;
