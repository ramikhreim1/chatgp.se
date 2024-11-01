const { SitemapStream, streamToPromise } = require('sitemap')
const { Readable } = require('stream')

const getSitemap = async () => {
    // An array with your links
    const links = [
        { url: '/ai/ChatGPT', priority: 1.0 },
        { url: '/tools', changefreq: 'daily', priority: 0.8 },
        { url: '/en', changefreq: 'daily', priority: 0.7 },
        { url: '/sv', changefreq: 'daily', priority: 0.7 },
        { url: '/', priority: 0.6 },
        { url: '/ai/dalle', priority: 0.7 },
        { url: '/ai/dalle/create', priority: 0.7 },
        { url: '/ai/whatsapp', priority: 0.7 },
        { url: '/my-profile', priority: 0.6 },
        { url: '/my-profile/feedback', priority: 0.5 },
        { url: '/my-profile/pricing', priority: 0.7 },
        { url: '/ai/code/interpret', priority: 0.7 },
        { url: '/ai/codex', priority: 0.7 },
        { url: '/ai/personal/summarize', priority: 0.7 },
        { url: '/ai/blog', priority: 0.7 },
        { url: '/ai/writing/intro', priority: 0.7 },
        { url: '/ai/business/jobad', priority: 0.7 },
        { url: '/ai/all/Emails_Content_Grammar_correction', priority: 0.7 },
        { url: '/ai/all/sales', priority: 0.7 },
        { url: '/ai/all/customer_service', priority: 0.8 },
        { url: '/ai/all/Email_Writer', priority: 0.8 },
        { url: '/ai/all/finance', priority: 0.7 },
        { url: '/ai/all/educational_content_creator', priority: 0.7 },
        { url: '/ai/all/storyteller', priority: 0.7 },
        { url: '/ai/all/marketing_developing', priority: 0.8 },
        { url: '/ai/all/social_media_influencer', priority: 0.7 },
        { url: '/ai/all/social_media_manager', priority: 0.7 },
        { url: '/aboutUs', priority: 0.5 },
        { url: '/contact-Us', priority: 0.5 },
        { url: '/FAQ', priority: 0.3 },
        { url: '/terms-condition', priority: 0.5 },
        { url: '/privacy-policy', priority: 0.5 },
        { url: '/cookie-policy', priority: 0.5 },
        { url: '/support', priority: 0.4 },
    ]

    // Create a stream to write to
    const stream = new SitemapStream({ hostname: process.env.DOMAIN })

    // Return a promise that resolves with your XML string
    return streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
        data.toString()
    )
}

module.exports = getSitemap