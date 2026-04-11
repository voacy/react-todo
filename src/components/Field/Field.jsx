import { forwardRef } from "react";
import styles from "./Field.module.scss";

const Field = forwardRef((props, ref) => {
	const {
		className = "",
		id,
		label,
		type = "text",
		onInput,
		value,
		error,
	} = props;

	return (
		<div className={`${styles.field} ${className}`}>
			<label className={styles.label} htmlFor={id}>
				{label}
			</label>
			<input
				className={`${styles.input} ${error ? styles.isInvalid : ""}`}
				id={id}
				placeholder=""
				autoComplete="off"
				type={type}
				onInput={onInput}
				ref={ref}
				value={value}
			/>
			{error && (
				<span className={styles.error} title={error}>
					{error}
				</span>
			)}
		</div>
	);
});

Field.displayName = "Field";

export default Field;
