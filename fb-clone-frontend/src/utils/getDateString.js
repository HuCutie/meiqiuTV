import { months } from "../DATE";

const getDateString = date => {
	if (!date) return "";
	let newDate = new Date(date);
	const day = newDate.getDate();
	const month = months[newDate.getMonth()];
	const year = newDate.getFullYear();
	const hours = newDate.getHours().toString().padStart(2, "0");
	const minutes = newDate.getMinutes().toString().padStart(2, "0");
	const seconds = newDate.getSeconds().toString().padStart(2, "0");

	return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
};

export default getDateString;