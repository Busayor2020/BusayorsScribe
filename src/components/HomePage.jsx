import React, {useState, useEffect, useRef} from 'react'

export default function HomePage(props) { const { setAudioStream, setFile } = props

const [recordingStatus, setRecordingStatus] = useState('inactive')
const [audioChunks, setAudioChunks] = useState ([])
const [duration, setDuration] = useState (0)

const mediaRecorder = useRef(null)

const mimeType = 'audio/webm'

async function startRecording () {
	let tempStream
		console.log["Start recording"]
		
		try{
			const streamData = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: false
			})
			tempStream = streamData
		} catch (err) {
			console.log(err.message)
			return
		}	
		setRecordingStatus('recording')
		
		//create new Media recorder instance using the stream
		const media = new MediaRecorder(tempStream, { type: mimeType })
		mediaRecorder.current = media
		
		mediaRecorder.current.start()
		let localAudioChunks = []
		mediaRecorder.current.ondataavailable = (event) => {
			if (typeof event.data === 'undefined') { return }
			if (event.data.size === 0) { return }
			localAudioChunks.push(event.data)
		}
		setAudioChunks(localAudioChunks)
}

async function stopRecording() {
	setRecordingStatus('inactive')
	console.log('Stop recording')
	
	mediaRecorder.current.stop()
	mediaRecorder.current.onstop = () => {
		const audioBlob = new Blob(audioChunks, { type: mimeType })
		setAudioStream(audioBlob)
		setAudioChunks([])
		setDuration(0)
	}
}

useEffect (() => {
	if (recordingStatus === 'inactive') { return }
	
	const interval = setInterval(() => {
		setDuration(curr => curr + 1)
	}, 1000) 	
	
	return () => clearInterval(interval)
})


return (
	<main className='flex flex-col justify-center flex-1 gap-3 p-4 pb-20 text-center sm:gap-4'>
		<h1 className='justify-center text-4xl font-semibold sm:text-6xl md:text-7xl'>Busayors'<span className='text-orange-500'>Scribe</span></h1>
		<h3 className='font-medium md:text-lg'> Record <span className='text-orange-500'><i className="fa-solid fa-arrow-right" /></span>Transcribe <span className='text-orange-500'><i className="fa-solid fa-arrow-right" /></span>Translate</h3> 
		
		<button onClick={recordingStatus === 'recording' ? stopRecording : startRecording} className='flex items-center justify-between max-w-full gap-4 px-4 py-2 mx-auto my-4 text-base specialBtn rounded-xl w-72'>
    <p className={recordingStatus === 'inactive' ? 'text-orange-500 hover:text-green-500' : 'hover:text-rose-600'}>{recordingStatus === 'inactive'?  'Record' : `Stop recording`}</p>
    <div className='flex items-center gap-2'>
        {duration !== 0 && (
            <p className='text-sm'>{duration}s</p>
        )}
        <i className={"fa-solid duration-200 fa-microphone text-black-500" + (recordingStatus === 'recording' ? ' text-green-500' : "")}/>
    </div>
</button>

		<p className='text-base'>Or <label className='text-orange-500 duration-200 cursor-pointer hover:text-green-500'>upload  <input onChange={(e) => {const tempFile = e.target.files[0]
		setFile(tempFile)
		}} className='hidden' type="file" accept='.mp3,.wave' /></label>an MP3 file.</p>
		<p className='italic text-slate-400'>Free now, free forever.</p>
	</main>
)}