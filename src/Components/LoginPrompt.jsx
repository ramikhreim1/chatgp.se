import React from 'react';
import Popup from 'reactjs-popup';
import { observer, inject } from 'mobx-react';
import './popup.css';
import { Link, withRouter } from 'react-router-dom';
import Logo from '../media/Logo';

const LoginPrompt = inject('store')(
  observer((props) => (
    <Popup
      open={props.store.popup.includes(props.id)}
      onClose={() => (props.store.popup = '')}
    >
      <div className="bg-black shadow-2xl rounded flex flex-wrap md:flex-nowrap di">
        <button
          className="popup-close-button hover:scale-50 z-0"
          onClick={() => (props.store.popup = '')}
        >
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </button>
        <div className="px-6 py-12 flex flex-col justify-center items-left w-96 max-w-sm">
          <div className="mb-4">
            <Logo width="350" />
          </div>
          <p className="text-gray-50 font-bold">
          Powered by OpenAI latest model, GPT-4 Plus Internet, is now available with Plus subscription for free:
          </p>
          <p className="text-gray-50">. Up-to-date content</p>
          <p className="text-gray-50">. Not limited to 2021</p>
          <p className="text-gray-50">. More creativity</p>
          <p className="text-gray-50">. Advanced reasoning</p>
          <p className="text-gray-50">. Complex instructions</p>
          <br />
          <p className="mb-4 text-gray-200 text-left text-sm font-bold">
            Log in or sign up for free, No credit card requried.
          </p>
          <div className="p-3">
            <Link
              onClick={() => {
                props.store.popup = '';
                props.store.setPrevLocation();
              }}
              className="mr-3 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              to="/login"
            >
              Log in
            </Link>
            <Link
              onClick={() => {
                props.store.popup = '';
                props.store.setPrevLocation();
              }}
              className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              to="/signup"
            >
              Sign up
            </Link>
          </div>
        </div>
        <video autoPlay muted className='flex-1' style={{ width: "640px" }} src="https://s3.eu-north-1.amazonaws.com/chatgp.se/chatgp.mp4"></video>
      </div>
    </Popup>
  )),
);

export default withRouter(LoginPrompt);