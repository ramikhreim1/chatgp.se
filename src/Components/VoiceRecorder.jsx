
const VoiceRecorder = ({  stopRecording, startRecording, status, ...props }) => {

    return (
        <div className="ml-1 flex item-">
            {status === "recording" ? <button disabled={props.disabled} onClick={stopRecording} type="button" className="cursor-pointer" title="Start Voice typing" aria-label="Start Recording">
                <div >
                    <svg
                        width={24}
                        height={24}
                        fill="none"
                        stroke="currentColor"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M18.375 4.5H5.625c-.621 0-1.125.504-1.125 1.125v12.75c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125Z" />
                    </svg>


                </div>
            </button> : <button title="Stop Voice typing" onClick={startRecording} type="button" className="cursor-pointer" aria-label="Start Recording">
                <div >
                    <svg
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M15.75 6C15.75 3.92893 14.0711 2.25 12 2.25C9.92893 2.25 8.25 3.92893 8.25 6V12C8.25 14.0711 9.92893 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12V6Z"
                            stroke="#4B5563"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M12 18.75V21.75"
                            stroke="#4B5563"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M18.7126 12.75C18.518 14.3936 17.7272 15.9087 16.49 17.0081C15.2528 18.1075 13.6552 18.7147 12.0001 18.7147C10.345 18.7147 8.74744 18.1075 7.51024 17.0081C6.27303 15.9087 5.48218 14.3936 5.2876 12.75"
                            stroke="#4B5563"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </button>}
        </div>
    )
}
export default VoiceRecorder