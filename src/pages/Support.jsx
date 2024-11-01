import Footer from "../Components/Footer"
import { Title } from "../Dashboard"

const Support = () => {
    return (<>
        <div className="container mx-auto overflow-hidden px-4 py-4 md:px-40 lg:px-60 md:py-8 lg:py-12">
            <Title title="Support" />
            <p className="mt-1 pr-1 text-sm mb-4 font-robot">
                Welcome to our SAS online platform. We're here to help you with any questions or issues you may have. Please select the option that best describes your needs:
            </p>
            <h3 className="uppercase tracking-wide text-sm font-bold leading-none my-3">
                Frequently Asked Questions (FAQ)
            </h3>
            <p className="mt-1 pr-1 text-sm mb-4 font-robot">
                Our FAQ page contains answers to some of the most commonly asked questions about our services and features. Check it out to see if your question has already been answered.
            </p>
            <h3 className="uppercase tracking-wide text-sm font-bold leading-none my-3">
                Contact Us
            </h3>
            <p className="mt-1 pr-1 text-sm mb-4 font-robot">
                you can't find the answer you're looking for on our FAQ page, please contact us. You can reach us by email, phone, or contact form. We will respond to your inquiry as soon as possible.
            </p>
            <h3 className="uppercase tracking-wide text-sm font-bold leading-none my-3">
                Chatbot Support
            </h3>
            <p className="mt-1 pr-1 text-sm mb-4 font-robot">
                If you're having trouble with our Chat GP Chatbot for your Website, our support team is here to help. Contact us through our chatbot or send us an email, and we'll work with you to resolve the issue.            </p>
            <h3 className="uppercase tracking-wide text-sm font-bold leading-none my-3">
                Payment Support
            </h3>
            <p className="mt-1 pr-1 text-sm mb-4 font-robot">
                If you're having trouble with payment processing or billing, please contact us. We use Klarna payment gateway along with Stripe to process payments for our services, and we'll work with you to resolve any issues.            </p>
            <h3 className="uppercase tracking-wide text-sm font-bold leading-none my-3">
                Technical Support
            </h3>
            <p className="mt-1 pr-1 text-sm mb-4 font-robot">
                If you're experiencing technical issues with our website or services, please contact us. Our technical support team is here to help you resolve any issues as quickly as possible.
            </p>
            <h3 className="uppercase tracking-wide text-sm font-bold leading-none my-3">
                Feedback
            </h3>
            <p className="mt-1 pr-1 text-sm mb-4 font-robot">
                We value your feedback and suggestions. If you have any ideas or suggestions for improving our services or website, please let us know. We appreciate your input and are always looking for ways to improve.
            </p>
            <p className="mt-1 pr-1 text-sm mb-4 font-robot">
                Thank you for using our SAS online platform. We're here to help you every step of the way.
            </p>
        </div >
        <Footer />
    </>
    )
}
export default Support