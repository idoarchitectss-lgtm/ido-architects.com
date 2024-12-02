import BackgroundForBreadcrumb from '@/components/custom/BackgroundForBreadcrumb';
import BreadcrumbComponent from '@/components/custom/breadcrumb/BreadcrumbComponent';
import Container from '@/components/custom/container';
import TouchTocontact from '@/components/custom/TouchTocontact';
import { reCruitPageFromWP } from '@/data/datafromWP';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

let id="cG9zdDoxMzMy" //id cuar trang tuyển dụng
const RecruitPage = async () => {
     const res = await reCruitPageFromWP(id);
  return (
    <div className='my-10'>
            <BackgroundForBreadcrumb 
            titleForPage='Ido Achitects tuyển dụng các vị trí công việc'
            />

      <Container>
        <BreadcrumbComponent/>
        <div>
            {/* <Image 
            src={res?.page.featuredImage?.node.sourceUrl}
            alt='recruit'
            width={1200}
            height={800}
            className='object-cover w-full h-full'
            /> */}
            <div dangerouslySetInnerHTML={{__html:res?.page.content}}></div>
        </div>
        <TouchTocontact 
        src="https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/466628780_1089355346529712_4375042002829101583_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeG0QwlHrYt7oI_jpuCBWbQ1h3yFPRoKS0mHfIU9GgpLSWgB8dRYnR08IRI2vnt1oAZsPbLdqqfZWqAdZK4ddMTX&_nc_ohc=OOJt-cAco4kQ7kNvgHwYhvn&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&_nc_gid=ARNaer0iUjXfFGrpFSNIGWn&oh=00_AYD_ngcEvzqqKi5Z6s2WWgSs7TgDgQRQzN1t9pGk_2TNxg&oe=6743C4EA"
        labelOfForm="Liên hệ với đội ngũ chúng tôi"
        />
        </Container>
    </div>
  )
}

export default RecruitPage