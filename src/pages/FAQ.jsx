import { useEffect, useState } from "react"
import Accordian from "../Components/Accordian"
import Footer from "../Components/Footer"
import content from "../content"
const FAQ = () => {
    const [faqs, setFaqs] = useState([])
    const [search, setSearch] = useState("")

    useEffect(() => {
        setFaqs(content.FAQs.default.filter(v => {
            return v.title.split('/').some((part) => part.toLowerCase().includes(search.toLowerCase())) || v.content.split('/').some((part) => part.toLowerCase().includes(search.toLowerCase()))
        }))
    }, [search])

    return (
        <>
            <section className="text-gray-800 bg-gray-100 px-8 py-12">
                <div
                    className="max-w-screen-xl grid gap-8 grid-cols-1 mb-12 md:mb-22 md:grid-cols-2 md:px-12 lg:px-16 xl:px-32 py-6 mx-auto bg-gray-100 text-gray-900 rounded-lg">
                    <div className="">
                        <div className="mb-8">
                            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">FAQ</h2>
                            <h2 className="text-gray-700 mt-1">
                                Frequently asked questions.
                            </h2>
                        </div>
                        <div>
                            <span className="text-gray-700">Any Questions? Look Here</span>
                            <input onChange={e => setSearch(e.target.value)} className="w-full bg-gray-300 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                                type="text" placeholder="Search" />
                        </div>
                    </div>
                    <div className="" style={{ overflow: "auto",maxHeight:"400px" }}>
                        {faqs.map(faq => {
                            return (<Accordian key={faq.id} title={faq.title} content={faq.content} />)
                        })}
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}
export default FAQ