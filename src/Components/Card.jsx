import FileSaver from 'file-saver';
import React from 'react';

import download from '../media/download.png';

export async function downloadImage(_id, photo) {
  FileSaver.saveAs(photo, `download-${_id}.jpg`);
}

const Card = ({ _id, name, prompt, photo }) => {
  // console.log(_id, name, prompt, photo);

  return (
    <div className="dallecard rounded-xl group relative shadow-card hover:shadow-cardhover card">
      <img
        loading='lazy'
        className="w-full h-auto object-cover rounded-xl"
        src={photo}
        alt={prompt}
      />
      <div className="dallecardpopup group-hover:flex flex-col max-h-[94.5%] hidden absolute bottom-0 left-0 right-0 m-2 p-4 rounded-md" style={{ background: "#10131f" }}>
        <p className="text-white text-sm overflow-y-auto prompt">{prompt}</p>

        <div className="mt-5 flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full object-cover bg-green-700 flex justify-center items-center text-white text-xs font-bold">{name[0]}</div>
            <p className="text-white text-sm">{name}</p>
          </div>
          <button type="button" onClick={() => downloadImage(_id, photo)} className="outline-none bg-transparent border-none">
            <img src={download} alt="download" className="w-6 h-6 object-contain invert" loading="lazy" style={{ filter: "invert(100%)" }} />
          </button>
        </div>
      </div>
    </div>
  )
};

export default Card;
