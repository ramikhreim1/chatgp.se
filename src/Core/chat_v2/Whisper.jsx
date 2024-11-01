import React from 'react'
import { AudioManager } from '../../Components/AudioManager'
import Transcript from '../../Components/Transcript'
import { useTranscriber } from '../../hooks/useTranscriber';

const Whisper = ({onExportText}) => {
    const transcriber = useTranscriber();
    return (
        <>
            <AudioManager transcriber={transcriber} />
            <Transcript transcribedData={transcriber.output} onExportText={onExportText}/>
        </>
    )
}

export default Whisper