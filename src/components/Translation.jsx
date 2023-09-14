import React from 'react'
import { LANGUAGES } from '../utils/presets'

export default function Translation (props)  {
	const { textElement, toLanguage, translating, setToLanguage, genarateTranslation } = props
	
	return (
		<div className='flex flex-col gap-2 max-w-[400px] w-full mx-auto'>
		{!translating && (<div className='flex flex-col gap-1'>
		<p className='text-xs sm:text-sm font-medium text-slate-500 mb-1 font-semibold'>To Language</p>
			<div className='flex flex-col sm:flex-row items-stretch gap-2' >
				<div className='w-full'>
					<select value={toLanguage} className='w-full outline-none bg-white focus:outline-none border border-solid border-transparent hover:border-orange-200 duration-200 p-2 rounded' onChange={(e) => setToLanguage (e.target.value)}>
						<option value={'Select language'}>Select language</option>
						{Object.entries(LANGUAGES).map(([key, value]) => {
							return (
								<option key={key} value={value}>{key}</option>
							)
						})}
					</select>
				</div>
				<div>
					<button onClick={genarateTranslation} className='specialBtn px-3 py-2 rounded-lg text-orange-400 hover:text-orange-600 duration-200'>
						Translate
					</button>
				</div>
			</div>
			</div>)}
			{(textElement && !translating) && (
				<p>{textElement}</p>
			)}
			{translating && (
				<div className='grid place-items-center'>
					<i className="fa-solid fa-spinner animate-spin" />
				</div>
			)}
			
	</div>		
	)
}
