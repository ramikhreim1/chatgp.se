import React, { useEffect } from 'react'
import inventoryStore from '../stores/Inventory'
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';


const InventoryList = () => {

    useEffect(() => {
        inventoryStore.getInventoryList();
    }, [])
    window["inventoryStore"] = inventoryStore

    return (
        <div>
            <div className="w-full py-8 overflow-auto">
                <div className="sm:flex sm:items-center px-6">
                    <div className="sm:flex-auto">
                        <div>
                            <div className="sm:block">
                                <nav className="flex space-x-4 " aria-label="Tabs">
                                    <button
                                        className="rounded-md px-3 py-2 text-sm font-medium"
                                        aria-current="page"
                                    >
                                        <h1 className="text-base font-semibold leading-6">
                                            Files / Urls
                                        </h1>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                    <div className="w-47 sm:w-62.55">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="appearance-none block w-full px-3 py-2 border placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-1 focus:border-transparent rounded-lg text-base border-gray-200 text-gray-800"
                            defaultValue=""
                        />
                    </div>
                </div>
                {inventoryStore.isinventoryListLoading && <div className='text-center px-6'><p>Loading...</p></div>}
                {!inventoryStore.isinventoryListLoading && inventoryStore.inventoryListComputed.length === 0 && <div className='text-center px-6'><p>Inventory Empty</p></div>}
                {inventoryStore.inventoryListComputed.length > 0 && <table className="w-full table-auto divide-y divide-gray-300">
                    <thead>
                        <tr>
                            <th
                                scope="col"
                                className="pl-6 pr-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                                <div className="flex items-center space-x-4">
                                    <p>Title</p>
                                    <div className="cursor-pointer w-5 h-5">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="#000"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                                <div className="flex items-center space-x-4">
                                    <p>File Type</p>
                                    <div className="cursor-pointer w-5 h-5">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="#000"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                                <div className="flex items-center space-x-4">
                                    <p>Updated On</p>
                                    <div className="cursor-pointer w-5 h-5">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="#000"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="#fff"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                                Chat Name
                            </th>
                            <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                            >
                                Remove
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {inventoryStore.inventoryListComputed.map(doc => {
                            return (<tr className=" ">
                                <td className="pl-6 pr-3 whitespace-nowrap py-4 text-sm">
                                    <div className="flex gap-2 items-center">
                                        <div className="max-w-[500px] truncate">
                                            <Link
                                                to={`/ai/ChatGPT?current_chat=${doc.chat_id}`}
                                                style={{
                                                    color: "black",
                                                    textDecoration: "none",
                                                    transition: "color 0.3s ease 0s",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                {doc.name}
                                            </Link>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-3 whitespace-nowrap py-4 text-sm">
                                    <div className="text-purple-1 text-xs font-bold">
                                        <span
                                            style={{
                                                boxSizing: "border-box",
                                                display: "inline-block",
                                                overflow: "hidden",
                                                width: "initial",
                                                height: "initial",
                                                background: "none",
                                                opacity: 1,
                                                border: 0,
                                                margin: 0,
                                                padding: 0,
                                                position: "relative",
                                                maxWidth: "100%"
                                            }}
                                        >
                                            <span
                                                style={{
                                                    boxSizing: "border-box",
                                                    display: "block",
                                                    width: "initial",
                                                    height: "initial",
                                                    background: "none",
                                                    opacity: 1,
                                                    border: 0,
                                                    margin: 0,
                                                    padding: 0,
                                                    maxWidth: "100%"
                                                }}
                                            >
                                                <img
                                                    alt=""
                                                    aria-hidden="true"
                                                    src="data:image/svg+xml,%3csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20version=%271.1%27%20width=%2725%27%20height=%2723%27/%3e"
                                                    style={{
                                                        display: "block",
                                                        maxWidth: "100%",
                                                        width: "initial",
                                                        height: "initial",
                                                        background: "none",
                                                        opacity: 1,
                                                        border: 0,
                                                        margin: 0,
                                                        padding: 0
                                                    }}
                                                />
                                            </span>
                                            <img
                                                alt=""
                                                srcSet="/images/icons/pdf.svg 1x, /images/icons/pdf.svg 2x"
                                                src="/images/icons/pdf.svg"
                                                decoding="async"
                                                data-nimg="intrinsic"
                                                className=""
                                                style={{
                                                    position: "absolute",
                                                    inset: 0,
                                                    boxSizing: "border-box",
                                                    padding: 0,
                                                    border: "none",
                                                    margin: "auto",
                                                    display: "block",
                                                    width: 0,
                                                    height: 0,
                                                    minWidth: "100%",
                                                    maxWidth: "100%",
                                                    minHeight: "100%",
                                                    maxHeight: "100%"
                                                }}
                                            />
                                        </span>
                                        <p>{getFileType(doc.name)}</p>
                                    </div>
                                </td>
                                <td className="px-3 whitespace-nowrap py-4 text-sm">
                                    <div className="max-w-[200px] truncate">
                                        {parseDate(doc.date).toDateString()}
                                    </div>
                                </td>
                                <td className="px-3 whitespace-nowrap py-4 text-sm">
                                    <div className="max-w-[200px] truncate">
                                        {doc.chat?.name || "No Chat"}
                                    </div>
                                </td>
                                <td className="px-3 whitespace-nowrap py-4 text-sm">
                                    <div className="flex">
                                        <div className="cursor-pointer items-center justify-center text-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                aria-hidden="true"
                                                className="h-4 w-4 text-red-600"
                                                onClick={() => inventoryStore.deleteADoc(doc)}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </td>
                            </tr>)
                        })}

                    </tbody>
                </table>}

            </div>

        </div>
    )
}

function getFileType(fileName) {
    var fileParts = fileName.split('.');
    var fileType = fileParts[fileParts.length - 1];
    return fileType;
}

function parseDate(dateString) {
    var year = parseInt(dateString.substring(0, 4));
    var month = parseInt(dateString.substring(4, 6)) - 1; // Month is zero-based, so subtract 1
    var day = parseInt(dateString.substring(6, 8));

    var date = new Date(year, month, day);
    return date;
}

export default observer(InventoryList);