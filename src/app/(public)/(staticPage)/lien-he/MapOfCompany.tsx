import Container from '@/components/custom/container'
import {motion} from 'framer-motion'

const MapOfCompany = () => {
  return (

   <motion.div 
   whileInView={{ opacity: 1}}
          initial={{ opacity: 0}} 
          viewport={{once:true}}
          transition={{duration:2}}
   className='w-full flex justify-center items-center mx-auto my-5'>
    <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d18350.876630362887!2d108.224647!3d16.0698759!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31421831f3ba9267%3A0xf9615bf30047a108!2zVMOyYSBuaMOgIERhbmFib29r!5e1!3m2!1svi!2s!4v1733051969491!5m2!1svi!2s" width="1400" height="550" loading="lazy" ></iframe>
   </motion.div>
  )
}

export default MapOfCompany