import React from 'react'

export default function Header() {
	return (
      <header className='flex items-center justify-between gap-4 p-4'>
				<a href="/"><img src="/logo2.png" alt="" /></a>
				<a href='/' className='flex items-center gap-2 px-3 py-2 text-sm text-orange-400 rounded-lg specialBtn bold'>
					<p>New</p>
					<i className="fa-sharp fa-solid fa-plus" />
				</a>
			</header>
	)
}
