import ContactForm from '@/components/custom/forms/ContactForm'
import React from 'react'

const SideBarComponent = () => {
  return (
  <div className='sticky top-44 w-[400px]'>
        <ContactForm 
        labelOfForm='Đăng ký tư vấn'
        />
    </div>
  )
}

export default SideBarComponent