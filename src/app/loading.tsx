import Sign from '@/components/sign'
import React from 'react'

function Loading() {
  return (
    <>
      <style>{`
        nav, [role="navigation"] { display: none !important; }
      `}</style>
        <Sign />
    </>
  )
}

export default Loading