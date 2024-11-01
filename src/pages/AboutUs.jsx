import { Link } from "react-router-dom"
import Footer from "../Components/Footer"

const AboutUs = () => {
    return (
        <>
            <section className="container mx-auto overflow-hidden px-4 py-16 md:px-40 lg:px-60 md:py-8 lg:py-12">
                <div className="text-center md:my-24">
                    <h2 className="text-3xl lg:text-5xl font-bold leading-tight mb-4 md:mb-8">Making AI accessable for all</h2>
                    <div className="text-gray-700 my-1">
                    Welcome to GPTech, your partner in AI-powered solutions for businesses. We are a team of experts passionate about the potential of AI to revolutionize the way we interact with language and information. Our mission is to share the benefits of AI GPT "Generative Pre-trained Transformer" in a fair and accessible way, making it easier for companies of all sizes to simplify their vital business needs and increase their productivity.
                    </div>
                    <div className="flex gap-3 justify-center mt-14">
                        <Link to="/contact-Us" className="font-inter px-8 transition-all duration-200 font-medium border border-blue-500 text-white py-2 rounded-md bg-blue-500 hover:bg-white hover:text-blue-500">Contact</Link>
                        <Link to="/" className="font-inter px-8 transition-all duration-200 font-medium border border-blue-500 text-blue-500 py-2 rounded-md  bg-white hover:bg-blue-500 hover:text-white">Home</Link>
                    </div>
                </div>
            </section>
            <section className="bg-white pb-10">
                <div className="container mx-auto overflow-hidden px-4 md:px-40 lg:px-60">
                    <div className="grid md:grid-cols-2 gap-14">
                        <div className="py-8 flex items-center">
                            <img src="/img-1.jpg" alt="" />
                        </div>
                        <div>
                            <div className="text-center  md:py-16">
                                <h2 className="text-3xl lg:text-5xl font-bold leading-tight mb-4 md:mb-8">About Us</h2>
                                <div className="text-gray-700 my-2">
                                Welcome to GPTech, your partner in AI-powered solutions for businesses. We are a team of experts passionate about the potential of AI to revolutionize the way we interact with language and information. Our mission is to share the benefits of AI GPT "Generative Pre-trained Transformer" in a fair and accessible way, making it easier for companies of all sizes to simplify their vital business needs and increase their productivity.
<br />
<br />
Our suite of AI-powered solutions includes Powered by ChatGPT API chatbot and prompts engineering templates, designed to provide customer support and respond to inquiries, freeing up human agents to focus on more complex tasks. We also offer DALL-E to generate high-quality images and designs, which can save time and resources for designers and artists.
<br />
<br />

At GPTech, we believe that AI has the potential to create new jobs and increase productivity in various industries, including healthcare, education, entertainment, and more. That's why we strive to create innovative solutions that help businesses and organizations achieve their goals while decreasing their costs and workload.
<br />
<br />

Our AI suite provides multiple channels for communicating with AI GPT, including ChatBot, Prompts Templates, WhatsApp, and Dynamic Web. With this suite, users can choose the channel that best fits their needs and preferences, allowing them to interact with AI GPT in a way that is most convenient and effective for them. Our Prompts engineering templates suite provides a user-friendly, real-time interface that enables easy interaction with AI Powered by ChatGPT API. Offering pre-built templates for various tasks related to email writing, code writing, marketing, and education.
<br />
<br />

We are committed to providing top-quality AI-powered solutions that simplify workflows and increase productivity for businesses. Our team of experts is dedicated to helping our clients succeed, and we are constantly working to improve our products and services. Contact us today to learn more about how we can help your business achieve its full potential with the power of AI.
                                </div>
                               
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}
export default AboutUs