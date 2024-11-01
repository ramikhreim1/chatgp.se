import React, { useEffect, useState } from 'react'
import { Tab } from '@headlessui/react'
import inventoryStore from "../stores/Inventory"
import { observer } from 'mobx-react';
import DragDropFile from "../Components/FileUpload";
import InventoryList from '../Components/InventoryList';
import Select from 'react-select';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Inventory = () => {
  return (
    <main className="flex-1 flex flex-col overflow-auto relative mt-4">
      <div className="flex-1 flex flex-col xl:flex-row overflow-auto relative">
        <div className="w-full flex-1 flex flex-col overflow-auto relative z-1">
          <div
            className="sticky top-0 w-full z-30"
            style={{
              minHeight: 12,
              background:
                "linear-gradient(rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0) 100%)",
              backfaceVisibility: "hidden",
              opacity: 0
            }}
          >
          </div>
          {/* <div className='flex justify-end'>
            <Storage />
          </div> */}

          <div className="bg-white z-20 px-5 py-2">
            <p className="text-2xl text-black-3 font-bold text-center">Inventory</p>
          </div>
          <div className="py-5">
            <div className="px-6">
              <p className="my-4 text-base text-gray-700 text-center">
                You can enhance the training of the ChatBot by uploading documents or including links to your knowledge base or website. This allows the ChatBot to learn from your specific data.
              </p>
              <div className="px-5 py-6 bg-gray-100 rounded-2xl">
                <Tab.Group>
                  <Tab.List className="flex space-x-1 rounded-xl bg-gray-200 p-1">
                    <div className="grid grid-cols-2 gap-2 bg-gray-11 p-0.6 w-fit mx-auto rounded-xl">

                      {inventoryStore.tabs.map((tab, idx) => (
                        <Tab
                          key={tab.name}
                          className={({ selected }) =>
                            classNames(
                              'px-4 py-2.5 rounded-xl cursor-pointer flex justify-center items-center space-x-1 transition-all text-sm font-semibold text-gray-600',
                              'outline-none',
                              selected
                                ? 'bg-white shadow'
                                : 'hover:bg-white/[0.12] hover:text-black'
                            )
                          }
                        >
                          <div>
                            {tab.icon}
                          </div>
                          <p> {tab.name}</p>
                        </Tab>
                      ))}
                    </div>
                  </Tab.List>
                  <Tab.Panels className="mt-2">
                    {inventoryStore.tabs.map((tab) => (
                      <Tab.Panel
                        key={tab.name}
                        className={classNames(
                          'rounded-xl bg-white p-3',
                          'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                        )}
                      >
                        {tab.name === "Upload File" && <DragDropFile accept=".txt, .csv, .md, .markdown, .m4a, .mp3, .webm, .mp4, .mpga, .wav, .mpeg, .pdf, .html, .pptx, .docx, .odt, .epub, .ipynb" support={"Text, document, spreadsheet, presentation, audio, video"} submit={false} onUpload={inventoryStore.setFile} />}
                        {tab.name === "Enter a Link" && <InputLink onLinkAdded={inventoryStore.setLink} />}

                      </Tab.Panel>
                    ))}
                  </Tab.Panels>

                </Tab.Group>

                <SelectChat />
                <UploadToTrainButton />
              </div>
            </div>
            <InventoryList />
          </div>
        </div>
      </div>
    </main>

  )
}

const InputLink = ({ onLinkAdded }) => {
  const [link, setLink] = useState('')
  useEffect(() => {
    onLinkAdded(link)
  }, [link, onLinkAdded])

  return (<div>
    <label htmlFor="link" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
      Enter link here
    </label>
    <input
      type="text"
      id="link"
      value={link}
      onChange={(e) => setLink(e.target.value)}
      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="https://example.com"
      required={true}
    />
  </div>)
}

const UploadToTrainButton = observer(() => {

  return (<button
    className="bg-purple-500 transition text-white font-bold rounded-xb-large px-4 flex justify-center items-center py-2 mx-auto w-48 mt-3 text-sm"
    type="button"
    onClick={() => inventoryStore.upload()}
    disabled={inventoryStore.isUploading}
  >
    {inventoryStore.isUploading && <svg
      className="animate-spin h-5 w-5 text-gray-50"
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
    </svg>}

    <div className="flex justify-center items-center">
      {inventoryStore.isUploading ? "Uploading" : "Upload"}
    </div>
  </button>)
})

const SelectChat = observer(() => {
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    inventoryStore.getChats().then(chats => {
      setOptions(chats.map(chat => ({ value: chat._id, label: chat.name })))
    })
  }, [])

  useEffect(() => {
    if (selectedOption)
      inventoryStore.chat_id = selectedOption.value
  }, [selectedOption])

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };


  return (<div className='py-2 flex gap-1 flex-col'>
    <h2>Chosen Chat for document upload: {selectedOption ? selectedOption.label : 'None'}</h2>
    <Select
      value={selectedOption}
      onChange={handleChange}
      options={options}
    />
  </div>)
})

const Storage = observer(() => {

  return (
    <ul class="w-96">
      <li
        class="w-full border-b-2 border-neutral-100 border-opacity-100 py-1 dark:border-opacity-50">
        Total Storage: {inventoryStore.storage.total_storage}
      </li>
      <li
        class="w-full border-b-2 border-neutral-100 border-opacity-100 py-1 dark:border-opacity-50">
        Remaining Storage: {inventoryStore.storage.remaining_free_space}
      </li>
      <li
        class="w-full border-b-2 border-neutral-100 border-opacity-100 py-1 dark:border-opacity-50">
        Current Storage: {inventoryStore.storage.current_storage_size}
      </li>
    </ul>
  )
})

export default Inventory