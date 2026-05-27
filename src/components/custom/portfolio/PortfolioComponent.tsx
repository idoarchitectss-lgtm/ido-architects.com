'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';

import Container from '@/components/custom/container';
import Title from '@/components/custom/title';
import PortfolioCate from './portfolioCate';

import { porfolioCategory, portfolios } from '@/types/typeForWordpressData';
import { usePathname } from 'next/navigation';

import MainButton from '../buttons/MainButton';
import { motion } from 'framer-motion'
import { PROPERTY_TYPES } from '@/features/posts/validations/post.schema';
interface PortfolioProps {
  portfoliosArray: portfolios[];
  porfolioCategoryArray: porfolioCategory[];
  title: string;
  subtitle: string;
  islightBg?: boolean;
  text?: string;
  href: string,
  labelOfButton: string
}

const PortfolioComponent: React.FC<PortfolioProps> = ({
  portfoliosArray,
  porfolioCategoryArray,
  title,
  subtitle,
  islightBg,
  text,
  href,
  labelOfButton
}) => {
  const pathname = usePathname();

  const [seletedcategory, setSeletedCategory] = useState<string | null>("Tất cả")

  const portfolios = portfoliosArray;
  const portfoliosByCategory = portfolios?.filter(portfolio => portfolio?.project.generalInformation.propertyType === seletedcategory)

  /** Chuyển enum value → label tiếng Việt, fallback về value gốc nếu không tìm thấy */
  const getPropertyLabel = (value: string) =>
    PROPERTY_TYPES.find((t) => t.value === value)?.label ?? value;

  useEffect(() => {
    console.log("seletedcategory", seletedcategory)
    console.log("portfolios", portfolios)
    // console.log("category",porfolioCategoryArray)
    // console.log("portfoliosByCategory", portfoliosByCategory)
  }, [portfolios, seletedcategory, porfolioCategoryArray, portfoliosByCategory])


  return (
    <section className=''>
      <div className='my-24'>
        <Container>
          <div>
            <Title
              title={title}
              islightBg={islightBg}
              subtitle={subtitle}
              text={text}
            />
          </div>

          {/* Dach sách category của các portfolios */}
          <motion.div 
          initial={{ opacity: 0,translateX:-100}}
          whileInView={{ opacity: 1,translateX:0}}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className='w-full overflow-x-scroll hiddenScrollBar'>
            <div
              className={` text-center font-semibold flex flex-row justify-center items-center gap-2 w-[1200px] md:w-10/12 mx-auto mb-5 border-neutral-500/30 border-b-[1px] 
          ${pathname === "/du-an" ? "block" : "hidden"}
          `}>
              <div className=
                {` w-[200px] px-5 py-3  cursor-pointer  text-neutral-500 border-neutral-500/30 border-[1px] border-b-[0px] rounded-none text-sm bg-neutral-100 hover:text-secondary duration-500 
            ${seletedcategory === "Tất cả" ? "text-neutral-500 font-[700] bg-white border-t-secondary border-[1px]" : ""}`}
                onClick={() => setSeletedCategory('Tất cả')}
              >
                Tất cả dự án
              </div>
              {
                porfolioCategoryArray.map((portfolioCategory) => (
                  <PortfolioCate
                    key={portfolioCategory.slug}
                    className={`w-[200px] px-5 py-3  cursor-pointer  text-neutral-500 border-neutral-500/30 border-[1px] border-b-[0px] rounded-none text-sm bg-neutral-100 hover:text-secondary duration-500
                    ${seletedcategory === portfolioCategory.name ? "text-neutral-500 font-[700] bg-white border-t-secondary border-[1px]" : ""} `}
                    nameOfCategory={getPropertyLabel(portfolioCategory.name)}
                    handleClick={() => setSeletedCategory(portfolioCategory.name)}
                  />
                ))}
            </div>
          </motion.div>

          <motion.div 
          initial={{ opacity: 0,translateX:100}}
          whileInView={{ opacity: 1,translateX:0}}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
          >
            {/* Portfolio by Name of project */}
            {seletedcategory && seletedcategory !== "Tất cả" ?
              (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
                  {portfoliosByCategory?.map((portfolio) => (
                    <Link
                      className='relative w-full h-[300px] md:h-[350px] group overflow-hidden flex flex-col justify-center items-center'
                      href={`du-an/${portfolio.slug}`}
                      key={portfolio.slug} >
                      <div className='relative flex-1  h-[200px] md:h-[250px] duration-300'>
                        {/* icon dự án nổi bật */}
                        <div className={`absolute z-10 w-10 h-10 top-7 right-7 ${(portfolio.project.isFeatured === true) ? "block" : "hidden"}`}>
                          <Image
                            src={'/image/star.png'}
                            alt='featured icon'
                            width={100}
                            height={100}
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <Image
                          src={portfolio.featuredImage?.node.sourceUrl}
                          alt={portfolio.project.nameOfProject}
                          width={1200}
                          height={800}
                          className=' object-cover  h-full'
                        />
                        <div className='absolute bottom-0 left-0 w-full h-full bg-black/40 translate-x-[100%] group-hover:translate-x-0 duration-700 text-white flex justify-center items-center'>
                          <ul className='text-base border-y-secondary border-y-[1px] py-2'>
                            <li>
                              Diện tích: {portfolio.project.generalInformation.floorDimension} m²
                            </li>
                            <li>
                              Quy mô: {portfolio.project.generalInformation.numberOfFloors} tầng
                            </li>
                            <li>
                              Loại công trình: {getPropertyLabel(portfolio.project.generalInformation.propertyType)}
                            </li>
                          </ul>
                        </div>
                      </div>


                      <div className='h-[50px] md:h-[50px] text-neutral-700 hover:text-secondary text-base font-[700] group-hover:opacity-100  duration-300 mt-2'>
                        <h3 className='group-hover:text-secondary duration-500 line-clamp-1'>{portfolio.project.nameOfProject}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              )
              :
              (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
                  {portfolios?.map((portfolio) => (
                    <Link
                      className='relative w-full h-[250px] md:h-[350px] group overflow-hidden flex flex-col justify-center items-center'
                      href={`du-an/${portfolio.slug}`}
                      key={portfolio.slug} >
                      <div className='relative flex-1  h-[200px] md:h-[250px] duration-300'>
                        {/* icon dự án nổi bật */}
                        <div className={`absolute w-10 h-10 top-7 right-7 ${(portfolio.project.isFeatured === true) ? "block" : "hidden"}`}>
                          <Image
                            src={'/image/star.png'}
                            alt='featured icon'
                            width={100}
                            height={100}
                            className='w-full h-full object-cover'
                          />
                        </div>
                        <Image
                          src={portfolio.featuredImage?.node.sourceUrl}
                          alt={portfolio.project.nameOfProject}
                          width={1200}
                          height={800}
                          className=' object-cover  h-full'
                        />
                        <div className='absolute bottom-0 left-0 w-full h-full bg-black/40 translate-x-[100%] group-hover:translate-x-0 duration-700 text-white flex justify-center items-center'>
                          <ul className='text-base border-y-secondary border-y-[1px] py-2'>
                            <li>
                              Diện tích: {portfolio.project.generalInformation.floorDimension} m²
                            </li>
                            <li>
                              Quy mô: {portfolio.project.generalInformation.numberOfFloors} tầng
                            </li>
                            <li>
                              Loại công trình: {getPropertyLabel(portfolio.project.generalInformation.propertyType)}
                            </li>
                          </ul>
                        </div>
                      </div>


                      <div className='h-[20px] md:h-[30px] text-neutral-700 hover:text-secondary text-base font-[700] group-hover:opacity-100  duration-300 mt-2 flex items-center justify-center'>
                        <h3 className='group-hover:text-secondary duration-500 line-clamp-1'>{portfolio.project.nameOfProject}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              )
            }
            <div className=' flex flex-col justify-center items-center w-full mt-5'>
              {
                pathname === "/du-an" ?
                  null
                  :
                  <MainButton
                    labelOfButton={labelOfButton}
                    href={href}
                  />
              }

            </div>
          </motion.div>
        </Container>
      </div>

    </section>
  )
}

export default PortfolioComponent