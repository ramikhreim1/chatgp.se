import React, { useState, useRef } from "react"

const Accordion = ({ title, content, ...props }) => {
    const [isOpened, setOpened] = useState(false)
    const [height, setHeight] = useState("0px")
    const contentElement = useRef(null)

    const HandleOpening = () => {
        setOpened(!isOpened)
        setHeight(!isOpened ? `${contentElement.current.scrollHeight}px` : "0px")
    }
    return (
        <div onClick={HandleOpening} className="rounded-t-lg border border-neutral-200 bg-white dark:border-neutral-600 dark:bg-neutral-800">
            <h2 className="mb-0" id="headingOne5" className="border-b border-neutral-200">
                <button
                    className="font-roboto group relative flex w-full items-center rounded-t-[15px] border-0 bg-white py-4 px-5 text-left text-base text-neutral-800 font-bold transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white [&:not([data-te-collapse-collapsed])]:bg-white [&:not([data-te-collapse-collapsed])]:text-primary [&:not([data-te-collapse-collapsed])]:[box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:[&:not([data-te-collapse-collapsed])]:bg-neutral-800 dark:[&:not([data-te-collapse-collapsed])]:text-primary-400 dark:[&:not([data-te-collapse-collapsed])]:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]"
                    type="button">
                    <span
                        className="mr-4 h-5 w-5 shrink-0 rotate-[-180deg] fill-[#336dec] transition-transform duration-200 ease-in-out group-[[data-te-collapse-collapsed]]:mr-0 group-[[data-te-collapse-collapsed]]:fill-[#212529] motion-reduce:transition-none dark:fill-blue-300 dark:group-[[data-te-collapse-collapsed]]:fill-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#336dec" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d={!isOpened ? "M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" : "M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"} />
                        </svg>

                    </span>
                    {title}
                </button>
            </h2>

            <div
                ref={contentElement}
                style={{ height: height }}
                className="overflow-hidden transition-all duration-500">
                <div className="py-4 px-5 font-roboto">
                    {content}
                </div>
            </div>
        </div>
    )
}

export default Accordion
