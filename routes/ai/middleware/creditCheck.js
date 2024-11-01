const db = require("../../models");
const User = db.user;

const creditCheck = async (req, res, next) => {

	let user = await User.findOne({ _id: req.user._id })

	if(user.credits > 0){
		next()
	} else {
		// res.statusMessage = 'No Credit Remaining';
		// res.sendStatus(401)
		res.json({
			success: false,
			credits: 0,
			error: "No Credits",
			message: "Congratulations! You've used up all your free credits chatting with our powerful ChatGPT Plus turbo model. We hope you enjoyed the experience so far.\nTo continue chatting, simply recharge your account on the profile page with just $2,5 and get another 250 credits. Thank you for choosing ChatGPT! To recharge your account, please visit our Buy Credits page : [Buy Credits](/my-profile). If you're interested in our pricing plans, please visit our Pricing Plans page: [Pricing](/my-profile/pricing). Happy chatting!\n\nGrattis! Du har använt upp alla dina gratis krediter genom att chatta med vår kraftfulla ChatGPT Plus turbo-modell. Vi hoppas att du har haft en trevlig upplevelse hittills. För att fortsätta chatta, ladda bara upp ditt konto på profilsidan med bara 2.5 dollar och få ytterligare 250 krediter. Tack för att du valde ChatGPT! För att ladda upp ditt konto, besök vår sida Köp krediter: [Buy Credits](/my-profile). Om du är intresserad av våra prissättningsplaner, besök vår sida Prissättningsplaner: [Pricing](/my-profile/pricing). Trevlig chatt!\n\nCongratulazioni! Hai esaurito tutti i tuoi crediti gratuiti chattando con il nostro potente modello turbo ChatGPT Plus. Speriamo che tu abbia apprezzato l'esperienza finora. Per continuare a chattare, ricarica semplicemente il tuo account sulla pagina del profilo con solo 2,5 dollaro e ottieni altri 250 crediti. Grazie per aver scelto ChatGPT! Per ricaricare il tuo account, visita la nostra pagina Acquista crediti: [Buy Credits](/my-profile). Se sei interessato ai nostri piani tariffari, visita la nostra pagina Piani tariffari: [Pricing](/my-profile/pricing). Buona chat!"
		})
		return
	}
}




module.exports = creditCheck