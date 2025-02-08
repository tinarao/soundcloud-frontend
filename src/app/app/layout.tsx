import React, { PropsWithChildren } from 'react'

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className='flex flex-col h-screen items-center justify-center'>
        <header className='py-4 border-b w-full'>
            <div className='container mx-auto flex justify-between'>
                Soundcloud
            </div>
        </header>
        <main className='container mx-auto flex-1'>
            {children}
        </main>
    </div>
  )
}

export default Layout