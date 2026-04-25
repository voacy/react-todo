import styles from "./Button.module.scss";

const Button = (props) => {
	const {
		className = "",
		type = "button",
		variant = "primary",
		children,
		onClick,
		isDisabled,
	} = props;

	return (
		<button
			className={`${styles.button} ${styles[variant]} ${className}`}
			type={type}
			onClick={onClick}
			disabled={isDisabled}
		>
			{children}
		</button>
	);
};

export default Button;
