import React from "react"

// drag drop file component
const DragDropFile = (props) => {
    // drag state
    const [dragActive, setDragActive] = React.useState(false);
    const [file, setFile] = React.useState(null);
    // ref
    const inputRef = React.useRef(null);

    // handle drag events
    const handleDrag = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    // triggers when file is dropped
    const handleDrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files.length && e.dataTransfer.files[0]) {
            props.onUpload({ files: e.dataTransfer.files })
            setFile(e.dataTransfer.files[0])
        }
    };

    // triggers when file is selected with click
    const handleChange = function (e) {
        // console.log(e.target.files);
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            props.onUpload({ files: e.target.files })
            setFile(e.target.files[0])
        }
    };

    // triggers the input when the button is clicked
    const onButtonClick = () => {
        inputRef.current.click();
    };
    const handleSubmit = () => {
        if (file) {
            props.onSubmit({ file })
        }
    }
    return (
        <>
            <form title="Drop a file or select any file to upload" id="form-file-upload" className="" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
                <input accept={props.accept} ref={inputRef} type="file" id="input-file-upload" multiple={true} onChange={handleChange} className="sr-only"
                    style={{ display: "none" }} />
                <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? "drag-active" : ""}>
                    <div>
                        <div className="w-10 h-10 text-gray-500 mx-auto flex flex-col content-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="black"
                                strokeWidth={1}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                        </div>
                        <button className="upload-button text-base" onClick={onButtonClick}><span className="text-black font-bold text-center">
                            Upload file from computer
                        </span></button>

                        <p className="pl-1 text-sm text-gray-600">or drag and drop here</p>
                        <p className="pt-2 text-xs text-gray-600">
                            {props.support}
                        </p>
                    </div>
                </label>
                {dragActive && <div id="drag-file-element" className="absolute top-0 left-0 w-full h-full" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
            </form >
            {file && <p className="text-base">{file.name} {bytesToSize(file.size)}</p>}
            {props.submit && <div className="mt-5 w-full sm:w-1/4 grid gap-2 grid-cols-1 sm:flex-row-reverse sm:ml-auto">
                <button
                    onClick={handleSubmit}
                    className="bg-green-600 transition text-white font-bold rounded-xb-large px-4 flex justify-center items-center py-2 active:bg-navy-1 hover:bg-purple-2 w-full text-sm"
                    type="button"
                >
                    <svg
                        className="animate-spin h-5 w-5 text-gray-50 hidden"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx={12}
                            cy={12}
                            r={10}
                            stroke="currentColor"
                            strokeWidth={4}
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                    <div className="flex justify-center items-center">Submit</div>
                </button>
            </div>}


        </>

    );
};
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return 'n/a';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    if (i === 0) return bytes + ' ' + sizes[i];
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
};

export default DragDropFile;