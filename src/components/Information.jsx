import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types';
import Transcription from './Transcription'
import Translation from './Translation'

export default function Information(props) {
	const { output, finished } = props
	const [tab, setTab] = useState('transcription')
	const [translation, setTranslation] = useState(null)
	const [toLanguage, setToLanguage] = useState('Select language')
	const [translating, setTranslating] = useState(null)
	console.log(output)
	
	const worker = useRef()
	
	useEffect(() => {
		if (!worker.current) {
			worker.current = new Worker(new URL('../utils/translate.worker.js', import.meta.url), {
				type: 'module'
			})
		}
		
 const onMessageReceived = async (e) => {
		switch (e.data.status) {
		case 'initiate':
			console.log('DOWNLOADING')
			break;
		case 'progress':
			console.log('LOADING')
			break;
		case 'update':
			setTranslation(e.data.output)
			console.log(e.data.output)
			break;
		case 'complete':
			setTranslating(false)
			console.log("DONE")
			break;
			}
		}
		
		worker.current.addEventListener('message', onMessageReceived)
		
		return () => worker.current.removeEventListener('message', onMessageReceived)	
	})
	
	const textElement = tab === 'transcription' ? 
	output.map(val => val.text) : translation || ''
	
	
	function handleCopy() {
		navigator.clipboard.writeText(textElement)
	}
	
	function handleDownload() {
		const element = document.createElement("a")
		const file = new Blob([textElement], { type: 'text/plain' })
		element.href = URL.createObjectURL(file)
		element.download = `Busayors'Scribe_${new Date().toString()}.txt`
		document.body.appendChild(element)
		element.click()
	}
	
	function genarateTranslation() {
		if (translating || toLanguage === 'Select language') {
			return
		}
		
		setTranslating(true)
		
		worker.current.postMessage({
			text: output.map(val => val.text),
			src_lang: 'eng_Latn',
			tgt_lang: toLanguage
		})
	}
	
	return (
		<main className='flex flex-col justify-center flex-1 w-full max-w-full gap-3 p-4 pb-20 mx-auto text-center sm:gap-4 max-w-prose'>
			<h1 className='justify-center text-4xl font-semibold sm:text-5xl md:text-6xl whitespace-nowrap'>Your <span className='text-orange-500'>Transcription</span></h1>
			
			
			<div className='grid items-center grid-cols-2 mx-auto overflow-hidden bg-white border border-solid rounded-full shadow border-grey-500'>
				<button onClick={() => setTab ('transcription')} className={'px-4 duration-200 py-1 ' + (tab === 'transcription' ? ' bg-orange-400 text-white' : 'text-orange-400 hover:text-gray-500')}>Transcription</button>
				<button onClick={() => setTab ('translation')} className={'px-4 duration-200 py-1 ' + (tab === 'translation' ? ' bg-orange-400 text-white' : 'text-orange-500 hover:text-gray-500')}>Translation</button>
			</div>
		<div className='my-8 flex flex-col'>
	
		{tab === 'transcription' ? (
				<Transcription {...props} textElement={textElement} />
			) : (
				<Translation {...props} toLanguage={toLanguage} 
				translating={translating} textElement={textElement}
				setTranslating={setTranslating} setTranslation={setTranslation}
				setToLanguage={setToLanguage}
				genarateTranslation={genarateTranslation}/>
			)}
		</div>
			<div className='flex items-center gap-4 mx-auto '>
				<button onClick={handleCopy} className='bg-white hover:text-orange-700 duration-200  text-orange-400 p-1 px-2 rounded'>
				<i className="fa-solid fa-copy" /> <br />
				Copy
				</button>
				<button onClick={handleDownload} className='bg-white hover:text-orange-700 duration-200 text-orange-400 p-1 px-2 rounded'>
				<i className="fa-solid fa-download" /> <br />
				Download
				</button>
			</div>
			</main>
	)
}

Information.propTypes = {
  output: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string
    })
  ).isRequired,
  finished: PropTypes.bool.isRequired
};
