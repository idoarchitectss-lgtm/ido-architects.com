import ContactForm from '@/components/custom/forms/ContactForm'
import TableOfContent from '@/components/custom/TableOfContent'
import type { TocHeading } from '@/components/custom/tiptap/heading-utils'
import React from 'react'

interface SideBarComponentProps {
  headings?: TocHeading[]
}

const SideBarComponent: React.FC<SideBarComponentProps> = ({ headings = [] }) => {
  return (
  <div className='sticky top-0'>
        <div className='space-y-3'>
          <ContactForm
        labelOfForm='Đăng ký tư vấn'
        />
        <TableOfContent headings={headings} />
        </div>
    </div>
  )
}

export default SideBarComponent