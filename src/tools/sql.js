import {
	ViewListIcon,
} from '@heroicons/react/solid'


const obj = {

	title: "Translate natural language to SQL queries",
	desc: " Convert human language input, commonly referred to as natural language, into structured queries using SQL (Structured Query Language).",
	category: "Programming",
	Icon: ViewListIcon,
	// tags: [],
	permissions: ['user'],

	fromColor: "gray-500",
	toColor: "gray-500",

	to: "/ai/sql",
	api: "/ai/sql",

	output: {
		title: "SQL query",
		desc: "The following key points detected",
		Icon: false,
		color: "blue",
	},

	prompts: [{
		title:"Entry Text",
		desc: "A sentence or paragraph you wish to transform it into a structured SQL query that can be executed against a database.",
		// n: 1,
		prompts: [{
				title: "Content",
				attr: "content",
				value: "",
				placeholder: "Write a query to list the names of the departments which employed more than 10 employees in the last 3 months Postgres SQL tables, with their properties",
				label: "",
				type: "textarea",
				maxLength: 600,
				// max: 100,
				min: 3,
				required: true,
				error: "",
				language: "sql",
				example: "A query to list the names of the departments which employed more than 10 employees in the last 3 months Postgres SQL tables, with their properties, Employee(id, name, department_id), Department(id, name, address), Salary_Payments(id, employee_id, amount, date)",
			},
		],
		example: {
			code: `SELECT d.name AS department_name
FROM Department d
INNER JOIN Employee e ON e.department_id = d.id
INNER JOIN Salary_Payments sp ON sp.employee_id = e.id
WHERE sp.date >= NOW() - INTERVAL '3 months'
GROUP BY d.id, d.name
HAVING COUNT(e.id) > 10;`,

			color: "blue",
		}
	}]

}

export default obj

