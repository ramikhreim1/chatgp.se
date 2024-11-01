import jobad from './jobad';
import summarize from './summarize';
import codeInterpret from './interpret';
import intro from './intro';
import chatGpt from './ChatGpt';
import Dall_E from './Dall_E';
import BLOG from './blog';
import codex from './codex';
// import explain from './explain';
import whatsApp from './whatsapp';
import email_from_url from './email_from_url';
import sql from './sql';
import all from './all';
const TOOLS = [
	chatGpt,
	BLOG,
	intro,
	jobad,
	email_from_url,
	Dall_E,
	summarize,
	// explain,
	whatsApp,
	...all,
	codeInterpret,
	codex,
	sql,
]

export default TOOLS
