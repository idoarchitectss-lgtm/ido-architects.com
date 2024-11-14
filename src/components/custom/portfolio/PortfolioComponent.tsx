'use client'
import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';

import Container from '@/components/custom/container';
import Title from '@/components/custom/title';
import PortfolioCate from './portfolioCate';

import MainButton from '../mainButton';
import { porfolioCategory, portfolios } from '@/types/typeForWordpressData';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { DEFAULT_IMG } from '@/lib/constants';

import {motion} from "framer-motion";

interface PortfolioProps {
  portfoliosArray: portfolios[];
  porfolioCategoryArray: porfolioCategory[];
}

const PortfolioComponent: React.FC<PortfolioProps> = ({
  portfoliosArray,
  porfolioCategoryArray
}) => {

  const pathname = usePathname();
  const route = useRouter();
  // const searchParams = useSearchParams();
  // const createUrl = new URLSearchParams(`query=?${searchParams}`)


  const [seletedcategory, setSeletedCategory] = useState<string | null>("Tất cả")

  const portfolios = portfoliosArray;
  const portfoliosByCategory = portfolios.filter(portfolio => portfolio?.project.generalInformation.propertyType === seletedcategory)

  useEffect(()=> {
    console.log("portfolio",portfolios)

    console.log("category",seletedcategory)

  },[portfolios,seletedcategory])

  
  return (
    <section >
      <div className='my-24'>
        <Container>
          <motion.div
          initial={{translateY:-300, opacity:0}}
          whileInView={{translateY:0, opacity:1}}
          viewport={{ once: true }}
          transition={
            {
              duration:1.5,
              type:"spring"
            }
          }
          >
            <Title
              title="Dự án nổi bật của IDO Architect"
              subtitle="Portfolio"
              islightBg
              text="Xem chi tiết những dự án nổi bật của chúng tôi"
            />
          </motion.div>

          {/* Dach sách category của các portfolios */}

          <motion.div
          initial={{scale:0.5, opacity:0}}
          whileInView={{scale:1, opacity:1}}
          viewport={{ once: true }}
          transition={
            {
              duration:3,
              type:"spring",
              ease:[0.6, 0.01, -0.05, 0.9]
            }
          }
          className='text-center font-semibold grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 w-12/12 md:8/12 mx-auto my-10'>
            <h3 className=
              {` py-3 cursor-pointer rounded-md hover:-translate-y-2 duration-300 
            ${seletedcategory === "Tất cả" ? "text-white bg-secondary" : ""}`}
              onClick={() => setSeletedCategory('Tất cả')}
            >
              Tất cả
            </h3>
            {
              porfolioCategoryArray.map((portfolioCategory) => (
                <PortfolioCate
                  key={portfolioCategory.slug}
                  className= {` py-3 hover:-translate-y-2 duration-300 rounded-md cursor-pointer 
                    ${seletedcategory === portfolioCategory.name ? "text-white bg-secondary" : ""} `}
                  nameOfCategory={portfolioCategory.name}
                  handleClick={() => setSeletedCategory(portfolioCategory.name)}
                />
              ))}
          </motion.div>

          <motion.div
          initial={{scale:0.2, opacity:0}}
          whileInView={{scale:1, opacity:1}}
          viewport={{ once: true }}
          transition={
            {
              duration:3.5,
              delay:0.5,
              staggerChildren:0.5,
              
              type:"spring",
              ease:[0.6, 0.01, -0.05, 0.9]
            }
          }
          >
            {/* Portfolio by Name of project */}
            {seletedcategory && seletedcategory !== "Tất cả" ?
              (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
                  {portfoliosByCategory.map((portfolio) => (
                    <Link
                      className='relative w-full h-[250px] md:h-[500px] group overflow-hidden rounded-md'
                      href={`portfolios/${portfolio.slug}`}
                      key={portfolio.slug} >
                      <Image
                        src={portfolio.featuredImage?.node?.sourceUrl || DEFAULT_IMG}
                        alt={portfolio.project?.nameOfProject}
                        width={1200}
                        height={800}
                        className='object-cover h-full group-hover:scale-125 duration-300'
                      />
                      <div className='absolute top-0 left-0 w-full h-full bg-primary/40 translate-x-[100%] group-hover:translate-x-0 duration-300'></div>
                      <div className='absolute left-10 bottom-5 text-white hover:text-secondary text-2xl opacity-0 group-hover:opacity-100 translate-y-[100%] group-hover:translate-y-0 duration-300'>
                        <h3 >{portfolio.project.nameOfProject}</h3>
                        <h3 >{portfolio.project.nameOfProject}</h3>
                        <ul className='text-base'>
                          <li>
                            Diện tích: {portfolio.project.generalInformation.floorDimension} m²
                          </li>
                          <li>
                            Quy mô: {portfolio.project.generalInformation.numberOfFloors} tầng
                          </li>
                          <li>
                            Loại công trình: {portfolio.project.generalInformation.propertyType}
                          </li>
                        </ul>
                      </div>
                    </Link>
                  ))}
                </div>
              )
              :
              (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>

                  {portfolios?.map((portfolio) => (
                    <Link
                      className='relative w-full h-[250px] md:h-[500px] group overflow-hidden rounded-md'
                      href={`portfolios/${portfolio.slug}`}
                      key={portfolio.slug} >
                      <Image
                        src={portfolio.featuredImage?.node.sourceUrl}
                        alt={portfolio.project.nameOfProject}
                        width={1200}
                        height={800}
                        className='object-cover h-full group-hover:scale-125 duration-300'
                      />
                      <div className='absolute top-0 left-0 w-full h-full bg-primary/40 translate-x-[100%] group-hover:translate-x-0 duration-300'></div>
                      <div className='absolute left-10 bottom-5 text-white hover:text-secondary text-2xl opacity-0 group-hover:opacity-100 translate-y-[100%] group-hover:translate-y-0 duration-300'>
                        <h3 >{portfolio.project.nameOfProject}</h3>
                        <ul className='text-base'>
                          <li>
                            Diện tích: {portfolio.project.generalInformation.floorDimension} m²
                          </li>
                          <li>
                            Quy mô: {portfolio.project.generalInformation.numberOfFloors} tầng
                          </li>
                          <li>
                            Loại công trình: {portfolio.project.generalInformation.propertyType}
                          </li>
                        </ul>
                      </div>
                    </Link>
                  ))}
                </div>
              )
            }
            <div className=' flex flex-col justify-center items-center w-full mt-5'>

              {
                pathname === "/portfolios" ?
                  null
                  :
                  <MainButton
                    className='w-[70%] md:w-[40%] lg:w-[35%] xl:w-[25%] 2xl:w-[20%] '
                    slug={`/portfolios`}
                    label='XEM THÊM'
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