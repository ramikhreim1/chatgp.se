const dev = {
	baseURL: "http://localhost:3080/api/",
	doc_query_baseURL: "http://localhost:8080",
	landingPageUrl: "http://localhost:3080",
	stripe: {
		free: "price_1Mqt1BK0vBwAJTX56hLWiN0g",
		entry: "price_1MX7n2K0vBwAJTX5oUvhXp0g",
		pro: "price_1MgRpmK0vBwAJTX5bL9Tey4U"
	},
	redirectURL: `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=http://localhost:3080/api/auth/google/callback&prompt=consent&response_type=code&client_id=196963812414-2nlu6elohtnsq8laov6rtj0du3ufksjm.apps.googleusercontent.com&scope=email%20profile`,
	clientId: "196963812414-2nlu6elohtnsq8laov6rtj0du3ufksjm.apps.googleusercontent.com"
};

let prod = {
	baseURL: '/api/',
	doc_query_baseURL: "https://openai-chatgpt.se",
	landingPageUrl: "https://www.jowry.click",
	redirectURL: `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=https://www.jowry.click/api/auth/google/callback&prompt=consent&response_type=code&client_id=196963812414-2nlu6elohtnsq8laov6rtj0du3ufksjm.apps.googleusercontent.com&scope=email%20profile`,
	stripe: {
		free: "price_1MrfJhK0vBwAJTX5vviXaGFQ",
		entry: "price_1MX7n2K0vBwAJTX5oUvhXp0g",
		pro: "price_1MgRpmK0vBwAJTX5bL9Tey4U"
	},
	clientId: "196963812414-2nlu6elohtnsq8laov6rtj0du3ufksjm.apps.googleusercontent.com"
};

prod = {
	baseURL: '/api/',
	doc_query_baseURL: "https://openai-chatgpt.se",
	landingPageUrl: "https://chatgp.se",
	redirectURL: `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=https://chatgp.se/api/auth/google/callback&prompt=consent&response_type=code&client_id=84432465616-tvnv2mf9tb7g1vbpqi6ov031k3ekqd6f.apps.googleusercontent.com&scope=email%20profile`,
	stripe: {
		free: "price_1MrfK1K0vBwAJTX5XYI6R0dn",
		entry: "price_1MgQ9LK0vBwAJTX5cHxUogxf",
		pro: "price_1OSb7eK0vBwAJTX5HqP4gFAO"
	},
	clientId: "196963812414-2nlu6elohtnsq8laov6rtj0du3ufksjm.apps.googleusercontent.com"
};

const config = process.env.NODE_ENV === 'development'
	? dev
	: prod;

export default config;
