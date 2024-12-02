'use client'
import { ChevronDown, Quote } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'


const SlogansComponent = () => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div
      className='h-[350px] w-full relative'
      style={{
        backgroundImage: "url('https://ido-architects.io/wp-content/uploads/2024/08/19-a-48-1.jpg')",
        backgroundPosition: "center",
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className='absolute top-0 left-0 w-full h-full bg-black/75 flex justify-center items-center'>
        <div className='flex flex-col text-center w-full md:w-[600px] lg:w-[800px] gap-5 px-6 md:px-4'>
          <motion.h2
            initial={{ opacity: 0, translateY: 100 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className='text-secondary text-3xl font-bold'>KIẾN TRÚC IDO ARCHITECTS</motion.h2>
          <motion.p
            initial={{ opacity: 0, }}
            whileInView={{ opacity: 1, }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className='text-white text-sm  md:text-base '>"Tại Ido Architects, chúng tôi không chỉ xây dựng những công trình đạt chuẩn về thẩm mỹ và chất lượng, mà còn xem mỗi dự án là nơi gửi gắm những giá trị tinh thần sâu sắc. Đó là sự đồng điệu giữa mong muốn của khách hàng và tâm huyết của đội ngũ chúng tôi, nhằm tạo nên những tác phẩm kiến trúc mang dấu ấn riêng và ý nghĩa bền vững."</motion.p>
          <motion.div
            initial={{ opacity: 0, translateY: -100 }}
            whileInView={{ opacity: 1, translateY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            onClick={() => router.push(`${pathname}#touch-to-contact`)}
            className='flex flex-col justify-center items-center cursor-pointer'>
            <ChevronDown
              className='text-secondary opacity-100 w-14 h-14 arrow' />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default SlogansComponent