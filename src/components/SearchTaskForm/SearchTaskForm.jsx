import { useContext } from "react";
import Field from "../Field/Field";
import { TasksContext } from "../../context/TasksContext";

const SearchTaskForm = (props) => {
	const { styles } = props;
	const { searchQuery, setSearchQuery } = useContext(TasksContext);

	return (
		<form
			className={styles.form}
			onSubmit={(event) => event.preventDefault()}
		>
			<Field
				className={styles.field}
				label="Seacrh task"
				id="search-task"
				type="search"
				value={searchQuery}
				onInput={(event) => setSearchQuery(event.target.value)}
			/>
		</form>
	);
};

export default SearchTaskForm;
