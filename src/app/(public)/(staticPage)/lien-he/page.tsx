'use client'
import Container from '@/components/custom/container'
import React from 'react'
import ContactComponent from './ContactComponent'
import MapOfCompany from './MapOfCompany'
import BackgroundForBreadcrumb from '@/components/custom/BackgroundForBreadcrumb'
import BreadcrumbComponent from '@/components/custom/breadcrumb/BreadcrumbComponent'

const ContactPage = () => {
  return (
    <main>
      <BackgroundForBreadcrumb
        titleForPage='Liên hệ'
      />
      <Container>
        <BreadcrumbComponent />
        <ContactComponent />
        <MapOfCompany />
      </Container>
    </main>
  )
}

export default ContactPage