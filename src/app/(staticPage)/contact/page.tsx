'use client'
import Container from '@/components/custom/container'
import React from 'react'
import ContactComponent from './ContactComponent'
import MapOfCompany from './MapOfCompany'
import BackgroundForBreadcrumb from '@/components/custom/BackgroundForBreadcrumb'

const ContactPage = () => {
  return (
    <main>
      <BackgroundForBreadcrumb />
      <Container>
        <ContactComponent />
      </Container>
      <MapOfCompany />
    </main>
  )
}

export default ContactPage