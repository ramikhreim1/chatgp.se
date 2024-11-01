import { observer, inject } from 'mobx-react'
import Footer from '../Components/Footer'
import awds from "../media/wstqr.png"
import chat from "../media/watsapp.png"
import emogi from "../media/emogi.png"
import { useState } from 'react'
import { Helmet } from "react-helmet";
import "./whatsapp.css"

const whasapp = inject("store")(observer((props) => {
    const [qr, setqr] = useState(window.store.profile?.status ? true : false)

    return (
        <div>
            {/* <section className="watsapp">
                <div className="h-screen m-auto container">
                    <div className="gap-3 flex h-full flex-wrap-reverse items-center justify-center lg:justify-between px-4 py-8">
                        <div className="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
                            <div className='w-3/4 m-auto'>
                                <article className='flex flex-col gap-3'>
                                    <h1 className='text-5xl md:font-bold md:text-7xl md:mb-3 md:py-8'>
                                    Have AI at your fingertips.
                                    </h1>
                                    <p className='pr-6'>
                                        Simple, reliable, private messaging and calling for free*, available
                                        all over the world.
                                    </p>
                                    <div>
                                        <a href='#useit' className='inline-block rounded-full bg-green-400 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#14a44d] transition duration-150 ease-in-out hover:bg-green-700 hover:shadow-[0_8px_9px_-4px_rgba(20,164,77,0.3),0_4px_18px_0_rgba(20,164,77,0.2)] focus:bg-success-600 focus:shadow-[0_8px_9px_-4px_rgba(20,164,77,0.3),0_4px_18px_0_rgba(20,164,77,0.2)] focus:outline-none focus:ring-0 active:bg-success-700 active:shadow-[0_8px_9px_-4px_rgba(20,164,77,0.3),0_4px_18px_0_rgba(20,164,77,0.2)]' type='button'>have it</a>
                                    </div>
                                    <div className='p-4'></div>
                                </article>
                            </div>

                        </div>
                        <div className="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12">
                            <div className="_af05">
                                <div
                                    className="_adch"
                                    style={{ top: "58%", left: "50%", width: "100%", zIndex: 0 }}
                                >
                                    <div className="_wauiAnimationWrapper__root" id="u_0_9_Rw">
                                        <div
                                            className="_wauiAnimationWrapper__content _aebf _wauiAnimationWrapper__cubicTwo _aebq _aebp _aeb6"
                                            id="u_0_a_8r"
                                            style={{ transitionDelay: "400ms" }}
                                        >
                                            <picture className="_9uh7 _9v95 _aeq_">
                                                <source
                                                    srcSet="https://scontent.whatsapp.net/v/t39.8562-34/329792464_534173148815054_3736500652022655929_n.png?ccb=1-7&_nc_sid=2fbf2a&_nc_ohc=el6BX2M7p1sAX_OooLH&_nc_ht=scontent.whatsapp.net&oh=01_AdRO51oAEAeDE92_Xqk2C3yYOofbc1iq5fgK8IGwXOUOdw&oe=64186443 2x"
                                                    media="(min-resolution: 2dppx), (-webkit-min-device-pixel-ratio: 2)"
                                                />
                                                <source
                                                    srcSet="https://scontent.whatsapp.net/v/t39.8562-34/329792464_534173148815054_3736500652022655929_n.png?ccb=1-7&_nc_sid=2fbf2a&_nc_ohc=el6BX2M7p1sAX_OooLH&_nc_ht=scontent.whatsapp.net&oh=01_AdRO51oAEAeDE92_Xqk2C3yYOofbc1iq5fgK8IGwXOUOdw&oe=64186443 1x"
                                                    media=""
                                                />
                                                <img
                                                    alt=""
                                                    className="_9v7q _aeq_"
                                                    src="https://scontent.whatsapp.net/v/t39.8562-34/329792464_534173148815054_3736500652022655929_n.png?ccb=1-7&_nc_sid=2fbf2a&_nc_ohc=el6BX2M7p1sAX_OooLH&_nc_ht=scontent.whatsapp.net&oh=01_AdRO51oAEAeDE92_Xqk2C3yYOofbc1iq5fgK8IGwXOUOdw&oe=64186443"
                                                />
                                            </picture>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="_adch"
                                    style={{ top: "66%", left: "50%", width: "100%", zIndex: 0 }}
                                >
                                    <div className="_wauiAnimationWrapper__root" id="u_0_b_ft">
                                        <div
                                            className="_wauiAnimationWrapper__content _aebf _wauiAnimationWrapper__cubicTwo _aebq _aebm _aeb6"
                                            id="u_0_c_F+"
                                            style={{ transitionDelay: "800ms" }}
                                        >
                                            <picture className="_9uh7 _9v95 _aeq_">
                                                <source
                                                    srcSet="https://scontent.whatsapp.net/v/t39.8562-34/326429760_565901131866976_8960223839941330956_n.png?ccb=1-7&_nc_sid=2fbf2a&_nc_ohc=rVa6jzwIHa8AX-Bv0Z4&_nc_ht=scontent.whatsapp.net&oh=01_AdQeJ-A9ZdJuv5xZoY9UHhTSuGWenN8utHHvm-iiny25Xw&oe=6417D408 1x"
                                                    media=""
                                                />
                                                <img
                                                    alt=""
                                                    className="_9v7q _aeq_"
                                                    src="https://scontent.whatsapp.net/v/t39.8562-34/326429760_565901131866976_8960223839941330956_n.png?ccb=1-7&_nc_sid=2fbf2a&_nc_ohc=rVa6jzwIHa8AX-Bv0Z4&_nc_ht=scontent.whatsapp.net&oh=01_AdQeJ-A9ZdJuv5xZoY9UHhTSuGWenN8utHHvm-iiny25Xw&oe=6417D408"
                                                />
                                            </picture>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="_adch"
                                    style={{ top: "80%", left: "50%", width: "100%", zIndex: 0 }}
                                >
                                    <div className="_wauiAnimationWrapper__root" id="u_0_d_43">
                                        <div
                                            className="_wauiAnimationWrapper__content _aebf _wauiAnimationWrapper__cubicTwo _aebq _aebp _aeb6"
                                            id="u_0_e_MS"
                                            style={{ transitionDelay: "1300ms" }}
                                        >
                                            <picture className="_9uh7 _9v95 _aeq_">
                                                <source
                                                    srcSet="https://scontent.whatsapp.net/v/t39.8562-34/325411784_1246981732900913_178427211297704021_n.png?ccb=1-7&_nc_sid=2fbf2a&_nc_ohc=8fRM7fU9WmUAX9es1Ue&_nc_ht=scontent.whatsapp.net&oh=01_AdRmAUPYxrbqwjt-0f3yOc083pPYS2GW_dAJ0Lq2vugOVw&oe=6417EEF5 2x"
                                                    media="(min-resolution: 2dppx), (-webkit-min-device-pixel-ratio: 2)"
                                                />
                                                <source
                                                    srcSet="https://scontent.whatsapp.net/v/t39.8562-34/318567080_617695970110803_5923371384204745052_n.png?ccb=1-7&_nc_sid=2fbf2a&_nc_ohc=p9Iwev5CREkAX_6csnE&_nc_ht=scontent.whatsapp.net&oh=01_AdTaQNFRo3WQCEpCHryAXVEgOt9Om37Gk5Pn5LiVe8mnTg&oe=641730A6 1x"
                                                    media=""
                                                />
                                                <img
                                                    alt=""
                                                    className="_9v7q _aeq_"
                                                    src="https://scontent.whatsapp.net/v/t39.8562-34/318567080_617695970110803_5923371384204745052_n.png?ccb=1-7&_nc_sid=2fbf2a&_nc_ohc=p9Iwev5CREkAX_6csnE&_nc_ht=scontent.whatsapp.net&oh=01_AdTaQNFRo3WQCEpCHryAXVEgOt9Om37Gk5Pn5LiVe8mnTg&oe=641730A6"
                                                />
                                            </picture>
                                        </div>
                                    </div>
                                </div>
                                <div className='p-4'></div>
                            </div>


                        </div>
                    </div>
                </div>
            </section> */}
            <Helmet>
                <title>{`whatsapp-Chat GP`}</title>
                <meta name="description" content="Chat GP + DALL-E + WhatsApp = AI Assistant" />
            </Helmet>
            <section className="background-radial-gradient overflow-hidden">
                <div className="px-6 py-12 md:px-12 text-center lg:text-left">
                    <div className="container mx-auto xl:px-32 text-gray-800">
                        <div className="grid lg:grid-cols-2 gap-12 flex items-center">
                            <div className="mt-12 lg:mt-0" style={{ zIndex: 10 }}>
                                <h1
                                    className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight mb-12"
                                    style={{ color: "hsl(218, 81%, 95%)" }}
                                >
                                    Whatsapp <br />
                                    <span style={{ color: "hsl(218, 81%, 75%)" }}>
                                        Chat GP-DALLE
                                    </span>
                                </h1>
                                <p className="opacity-70" style={{ color: "hsl(218, 81%, 85%)" }}>
                                    Our WhatsApp-based service allows you to generate instant Chat GP results and Dall-E images by simply sending a text to our number. You can upscale and make variations by replying with an emoji. We offer free requests for free plan subscribers.
                                </p>
                            </div>
                            <div className="mb-12 lg:mb-0 relative">
                                {/* <div
                                    id="radius-shape-1"
                                    className="absolute rounded-full shadow-lg"
                                />
                                <div id="radius-shape-2" className="absolute shadow-lg" /> */}
                                <div className="block px-6 py-12 md:px-12">
                                    <img src={emogi} width={300} alt="" />
                                    <img src={chat} width={360} alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {<section id="useit" className='my-8'>
                <div className="m-auto container">
                    <div className="gap-3 flex h-full flex-wrap items-center justify-center px-4">

                        <div className="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12 flex justify-end">
                            <div className=''>
                                {qr ? <img src={awds} alt="QR" width={340} /> : <button className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800' onClick={() => { window.store.ensurePlan() && setqr(true) }}>Show QR</button>}

                            </div>
                        </div>
                        <div className="shrink-1 mb-12 grow-0 basis-auto md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
                            <div className='md:w-1/2 m-auto'>
                                <article className='text-black flex flex-col gap-3'>
                                    <h2 className='text-lg md:font-bold md:text-xl md:mb-3'>
                                        How to Use Whatsapp Chat GP-DALLE
                                    </h2>
                                    <p className='pr-6 text-sm'>
                                    To use our AI Assistant, simply follow these easy steps: First, scan the QR code or add the number. Then, start chatting with Chat GP Turbo and begin creating your very own Dall-E images! All you need to do is send a message that includes the !dalle command along with your desired prompt. It's that easy! So why wait? Try our innovative AI Assistant today and unleash your creativity!<br /><br />
                                        <span className='font-bold'>Chat GP</span><br />
                                        Please explain the purpose of existence. <br /><br />
                                        <span className='font-bold'>DALLE</span> <br />
                                        !dalle A blue bird is singing in a tree.
                                    </p>
                                </article>
                            </div>

                        </div>
                    </div>
                </div>
            </section>}
            <Footer />
        </div>
    )
}))
export default whasapp