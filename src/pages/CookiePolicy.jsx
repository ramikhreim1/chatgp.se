import { Link } from "react-router-dom"
import Footer from "../Components/Footer"
import content from "../content/index"
import { Title } from "../Dashboard"

const CookiePolicy = () => {
  return (
    <>
      <div className="container mx-auto overflow-hidden px-4 py-4 md:px-40 lg:px-60 md:py-8 lg:py-12">
        <Title title="Cookie Policy" />
        <p className="mt-1 pr-1 text-sm mb-4 font-robot">
          We at ChatGP use cookies on our website available at www.chatgp.se (the "Website"). By using our website, you consent to our use of cookies in accordance with this Cookie Policy.
        </p>
        <h3 className="uppercase tracking-wide text-sm font-bold leading-none my-3">
          What are Cookies?
        </h3>
        <p className="mt-1 pr-1 text-sm mb-4 font-robot">
          Cookies are small text files that are stored on your computer or mobile device when you visit our website. They help us improve your experience on our website by providing information about how you use our website.
        </p>
        <h3 className="uppercase tracking-wide text-sm font-bold leading-none my-3">
          Types of Cookies We Use
        </h3>
        <p className="mt-1 pr-1 text-sm mb-4 font-robot">
          We use both session cookies and persistent cookies on our website. Session cookies are temporary cookies that are deleted when you close your browser. Persistent cookies remain on your computer or mobile device until they expire or you delete them.
        </p>
        <p className="mt-1 pr-1 text-sm mb-4 font-robot">
          We use both first-party cookies and third-party cookies on our website. First-party cookies are set by our website, while third-party cookies are set by third-party websites or services. We use Google Analytics to analyze how our website is used and to improve our website. Google Analytics uses cookies to collect information about your use of our website, such as your IP address, browser type, and operating system.
        </p>
        <h3 className="uppercase tracking-wide text-sm font-bold leading-none my-3">
          How We Use Cookies
        </h3>
        <p className="mt-1 pr-1 text-sm mb-4 font-robot">
          We use cookies to:<br />
          <ul>
            <li>
              Improve your experience on our website
            </li>
            <li>
              Understand how our website is used
            </li>
            <li>
              Remember your preferences and settings
            </li>
            <li>
              Provide you with personalized content and advertising.
            </li>
          </ul>
        </p>
        <h3 className="uppercase tracking-wide text-sm font-bold leading-none my-3">
          Your Cookie Choices
        </h3>
        <p className="mt-1 pr-1 text-sm mb-4 font-robot">
          You can control your cookie settings on our website by using the cookie banner that appears when you visit our website. You can choose to accept or reject cookies. Please note that rejecting cookies may affect your experience on our website.
          <br />
          You can also control your cookie settings in your browser settings. Most web browsers allow you to control cookies through their settings.
        </p>
        <h3 className="uppercase tracking-wide text-sm font-bold leading-none my-3">
          Third-Party Websites
        </h3>
        <p className="mt-1 pr-1 text-sm mb-4 font-robot">
          Our website may contain links to third-party websites that are not under our control. We are not responsible for the cookies used by these third-party websites.
        </p>
        <h3 className="uppercase tracking-wide text-sm font-bold leading-none my-3">
          Updates to Cookie Policy
        </h3>
        <p className="mt-1 pr-1 text-sm mb-4 font-robot">
          We may update this Cookie Policy from time to time without prior notice. We encourage you to review this Cookie Policy periodically to be aware of any changes.
        </p>
        <h3 className="uppercase tracking-wide text-sm font-bold leading-none my-3">
          Contact Us
        </h3>
        <p className="mt-1 pr-1 text-sm mb-4 font-robot">
          If you have any questions or concerns about our Privacy Policy, please contact us at <Link className="text-blue-700 hover:underline" to={"contact-Us"}>Contact Page</Link>.
          Thank you for using our SAS online platform.
          I hope you find this draft helpful. Please note that this is a general template and should be reviewed by a legal expert to ensure compliance with all applicable laws and regulations.
        </p>
      </div >
      <Footer />
    </>
  )
}
export default CookiePolicy