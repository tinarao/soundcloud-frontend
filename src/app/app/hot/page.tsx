import { BASIC_API_URL } from '@/lib/consts'
import axios from 'axios'
import React from 'react'

const Page = async () => {
    const best = await axios<Track[]>(BASIC_API_URL + 'track/hot');
    console.log(best)

  return (
    <div className='grid grid-cols-4'>
        {best.data.map((track) => (
            <div className='col-span-1' key={track.id}>{track.title}</div>
        ))}
    </div>
  )
}

export default Page