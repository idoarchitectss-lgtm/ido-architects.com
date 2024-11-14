import Container from '../container'
import NewsletterForm from '../forms/NewsletterForm'

const Newsletter = () => {
  return (
    <section className='bg-secondary'>
        <Container>
          <div className='text-white h-[150px] py-0 md:py-5'>
            <NewsletterForm />
          </div>
        </Container>
    </section>
  )
}
export default Newsletter;