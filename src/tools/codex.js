import {
	ViewListIcon,
} from '@heroicons/react/solid'


const obj = {

	title: "Write code in any programming language, Python, Node js , Cloudformation, Javascript, react js......",
	desc: "Codex is a powerful tool for writing code. It allows developers to write code quickly and efficiently, without having code skills.",
	category: "Programming",
	Icon: ViewListIcon,
	// tags: [],
	permissions: ['user'],

	fromColor: "gray-500",
	toColor: "gray-500",

	to: "/ai/codex",
	api: "/ai/codex",

	output: {
		title: "codex",
		desc: "The following key points detected",
		Icon: false,
		color: "blue",
	},

	prompts: [{
		title: "Entry Text",
		desc: "A sentence or paragraph you wish to improve existing code or create new by describing what you want to accomplish.",
		// n: 1,
		prompts: [{
			title: "Content",
			attr: "content",
			value: "",
			placeholder: "Create an html skeleton with bootstrap responsive design, Write an introduction for my portfolio website. I am a beginner AI user and a programmer..",
			label: "",
			type: "textarea",
			maxLength: 600,
			// max: 100,
			min: 3,
			required: true,
			error: "",
			language: "html",
			example: "Create an html skeleton with bootstrap responsive design and responsive menu and responsive hamburger menu that works on mobile as well. And import all the necessary scripts before the closing body tag, such as jquery, popper and bootstrap.llo World ",
		},
		],
		example: {
			code: `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">\n<title>My Website</title>\n<!-- Link to Bootstrap CSS -->\n<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">\n</head><body>\n<!-- Navbar -->\n<nav class="navbar navbar-expand-lg navbar-light bg-light">\n<a class="navbar-brand" href="#">My Website</a>\n<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">\n<span class="navbar-toggler-icon"></span>\n</button>\n<div class="collapse navbar-collapse" id="navbarNav">\n<ul class="navbar-nav">\n<li class="nav-item active">\n<a class="nav-link" href="#">Home</a>\n</li>\n<li class="nav-item">\n<a class="nav-link" href="#">About</a>\n</li>\n<li class="nav-item">\n<a class="nav-link" href="#">Contact</a>\n</li>\n</ul>\n</div>\n</nav>\n<!-- Main Content -->\n<div class="container">\n<h1>Hello World!</h1>\n<p>This is my website.</p>\n</div>\n<!-- Link to jQuery -->\n<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>\n<!-- Link to Popper.js -->\n<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>\n<!-- Link to Bootstrap JS -->\n<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>\n</body>\n</html>`,
			// outputs: [
			// 	"The sun is very old, over 4.5 billion years",
			// 	"At 10,000 degrees, sun is also very hot",
			// 	"Gasses called coronal mass ejections erupt from the sun",
			// ],
			// Icon: RefreshIcon,
			color: "blue",
		}
	}]

}

export default obj

