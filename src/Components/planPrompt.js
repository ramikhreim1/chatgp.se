import React from 'react';
import Popup from 'reactjs-popup';
import { observer, inject } from 'mobx-react'
import "./popup.css"
import { Link } from 'react-router-dom';
import Logo from '../media/Logo';

const PlanPrompt = inject('store')(observer((props) => {
    // console.log(props.store.popup);
    return (
        <Popup open={props.store.popup.includes(props.id)} onClose={() => props.store.popup = ""}>
            <div className="bg-black shadow-2xl rounded flex flex-wrap" >
                <div className='px-6 py-12 flex flex-col justify-center items-center w-96 max-w-sm'>
                    <div className='mb-4'><Logo width="50" /></div>
                    <p className='text-gray-50 mb-2'>Welcome to ChatGP</p>
                    <p className='mb-6 text-gray-200 text-center text-sm'>Log in with your ChatGP account to Unlock the power of AI start exploring our powerful tools Powered by OpenAI.</p>
                    <div className='p-3'>
                        <Link onClick={() => props.store.popup = ""} className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800' to={"/pricing"}>Free trial</Link>
                        <Link onClick={() => props.store.popup = ""} className='focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-3 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800' to={"/pricing"}>See Plans</Link>
                    </div>
                </div>
                <video autoPlay muted className='flex-1' style={{ width: "640px" }} src="https://s3.eu-north-1.amazonaws.com/chatgp.se/chatgp.mp4"></video>
                {/* {props.store.popup.includes("with_att") && <img src="https://s3.eu-north-1.amazonaws.com/chatgp.se/OpenAI.gif"></img>} */}
            </div>
        </Popup>
    )
}))

export default PlanPrompt;