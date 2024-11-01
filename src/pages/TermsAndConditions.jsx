import Footer from "../Components/Footer"
import { Title } from "../Dashboard"

const TermsAndConditions = () => {
    return (<>
        <div className="container mx-auto overflow-hidden px-4 py-4 md:px-40 lg:px-60 md:py-8 lg:py-12">
            <Title title="Terms and Conditions" />
            <p className="mt-1 pr-1 text-sm mb-4 font-robot">
                Welcome to our SAS online platform. These terms and conditions govern your use of our website and services. By using our website and services, you agree to be bound by these terms and conditions. If you do not agree to these terms and conditions, you may not use our website or services.
            </p>
            <h3 className="uppercase tracking-wide text-sm font-bold leading-none my-3">
                Services
            </h3>
            <p className="mt-1 pr-1 text-sm mb-4 font-robot">
                Our SAS online platform provides chatbot prompts, templates, and tools to help you create high-quality content. We also offer a Chat GP Chatbot for your Website that allows you to create a custom Chat GP chatbot and put it on your website in just 5 minutes. In addition, we offer Dall-e, a tool that uses artificial intelligence to generate unique and stunning photos that you can use in your content. We may add or remove services or features from our website at any time without prior notice.
            </p>
            <h3 className="uppercase tracking-wide text-sm font-bold leading-none my-3">
                Payment
            </h3>
            <p className="mt-1 pr-1 text-sm mb-4 font-robot">
                We use Klarna payment gateway along with Stripe to process payments for our services. Payment for our services is due at the time of purchase. If payment is not received, we reserve the right to suspend or terminate your account or access to our services. You agree to provide accurate and complete payment information, and you authorize us to charge your payment method for all charges incurred in connection with your use of our services.
            </p>
            <h3 className="uppercase tracking-wide text-sm font-bold leading-none my-3">
                User Content
            </h3>
            <p className="mt-1 pr-1 text-sm mb-4 font-robot">
                You retain ownership of any content you upload or submit to our website. However, by uploading or submitting content, you grant us a non-exclusive, worldwide, royalty-free, perpetual, and irrevocable license to use, modify, and display your content in connection with our website and services. You represent and warrant that you have all necessary rights to grant this license.
            </p>
            <h3 className="uppercase tracking-wide text-sm font-bold leading-none my-3">
                Intellectual Property
            </h3>
            <p className="mt-1 pr-1 text-sm mb-4 font-robot">
                All intellectual property rights in our website and services, including without limitation, trademarks, logos, copyright, and patents, are owned by or licensed to us. You agree not to use any of our intellectual property without our prior written consent.
            </p>
            <h3 className="uppercase tracking-wide text-sm font-bold leading-none my-3">
                Privacy
            </h3>
            <p className="mt-1 pr-1 text-sm mb-4 font-robot">
                We take your privacy seriously and have implemented policies and procedures to protect your personal information. Please refer to our Privacy Policy for more information.
            </p>
            <h3 className="uppercase tracking-wide text-sm font-bold leading-none my-3">
                Limitation of Liability
            </h3>
            <p className="mt-1 pr-1 text-sm mb-4 font-robot">
                To the maximum extent permitted by law, we shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages arising from your use of our website and services, including without limitation, loss of profits, data, or use of our services. You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from your use of our website and services.
            </p>
            <h3 className="uppercase tracking-wide text-sm font-bold leading-none my-3">
                Governing Law
            </h3>
            <p className="mt-1 pr-1 text-sm mb-4 font-robot">
                These terms and conditions shall be governed by and construed in accordance with the laws of the jurisdiction where we are incorporated. Any dispute arising out of or in connection with these terms and conditions shall be resolved through arbitration.
            </p>

            <p className="mt-1 pr-1 text-sm mb-4 font-robot">
                Thank you for using our SAS online platform. If you have any questions or concerns, please contact us.
            </p>
        </div >
        <Footer />
    </>
    )
}
export default TermsAndConditions