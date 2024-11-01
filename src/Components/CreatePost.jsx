import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';


import preview from '../media/preview.png';
import Loader from './Loader.jsx';
import { FormField } from '.';
import FileSaver from 'file-saver';
import { Link, Redirect } from 'react-router-dom';
import ReactMarkdown from 'react-markdown'

async function downloadImage(photo, prompt) {
  FileSaver.saveAs(photo, `download-${prompt}.jpg`);
}

const CreatePost = ({ getRandomPrompt, prompt, setPrompt, photo, setPhoto, api, tool }) => {
  // const navigate = useNavigate();

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // console.log("sdf");


  const generateImage = async () => {
    if (!window.store.ensurePlan()) return

    if (prompt) {
      setError("")
      try {
        setGeneratingImg(true);
        const response = await api.post(tool.imgAPI, { content: prompt })
        if (response.data.credits === 0) {
          setError(response.data.message)
        } else {
          setPhoto(`data:image/jpeg;base64,${response.data.photo}`);
        }
      } catch (err) {
        setError(err.response?.message);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      setError('Please provide proper prompt');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.store.ensureLogin()) return

    if (prompt && photo) {
      setError("")
      setLoading(true);
      try {
        await api.post("/post", {
          prompt: prompt,
          photo: photo
        })

        alert('Success');
        // window.store.history.push('/ai/dalle')
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please generate an image with proper details');
    }
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div className='flex'>
        <div className='flex-1'>
          <h1 className="font-extrabold text-[#222328] text-[32px]">Create</h1>
          <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">Generate an imaginative image through DALL-E AI and share it with the community</p>
        </div>
        <div>
          <Link to="/ai/dalle" className="font-inter font-medium text-white px-4 py-2 rounded-md" style={{ background: "#6469ff" }}>Posts</Link>
        </div>
      </div>

      <form className="mt-12 max-w-3xl" onSubmit={(e)=>handleSubmit(e)}>
        <div className="flex flex-col gap-5 mb-3">
          <FormField
            labelName="Start with a detailed description"
            type="text"
            name="prompt"

            placeholder="An Impressionist oil painting of sunflowers in a purple vase…"
            value={prompt}
            handleChange={e => { setPrompt(e.target.value) }}
            isSurpriseMe
            handleSurpriseMe={() => getRandomPrompt()}
          />


        </div>




        {<div className="relative mb-3 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
          {photo ? (
            <>
              <img
                src={photo}
                alt={prompt}
                className="w-full h-full object-contain"
              />
            </>
          ) : (

            <img
              src={preview}
              alt="Generate a response"
              className="w-9/12 h-9/12 object-contain opacity-40"
            />
          )}

          {generatingImg && (
            <div className="absolute inset-0 z-0 flex justify-center items-center rounded-lg" style={{ background: "rgba(0,0,0,0.5)" }}>
              <Loader />
            </div>

          )}
        </div>}
        {photo ? <button type='button' onClick={() => downloadImage(photo, prompt)} className="bg-blue-500 mt-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
          Download
        </button> : null}
        <div className="mt-3 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className="mb-3 text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? 'Generating...' : 'Generate'}
          </button>
        </div>
        {error && <div className="m-auto mt-4"><ReactMarkdown
                               className="text-red-700 stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6" style={{ width: "85%" }}
                                         components={{
                                            a: CustomLink // Define custom renderer for link nodes
                                        }}children={error} /></div>}

        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">** Once you have created the image you want, you can share it with others in the community **</p>
          {
            photo && <button
              type="submit"
              className="mt-3 text-white font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              style={{ background: "#6469ff" }}
            >
              {loading ? 'Sharing...' : 'Share with the Community'}
            </button>
          }

        </div>
      </form>
    </section>
  );
};
// Custom link component using React Router's Link component
const CustomLink = ({ href, children }) => {
  return (
      <Link className='underline font-bold' to={href}>
          {children}
      </Link>
  );
};

export default CreatePost;
