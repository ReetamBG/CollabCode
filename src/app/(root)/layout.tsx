import RootNavbar from '@/components/RootNavbar'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <RootNavbar />
      {children}
    </>
  )
}

export default layout