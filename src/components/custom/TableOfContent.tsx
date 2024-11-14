import { link } from 'fs';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const TableOfContent = () => {
    const [heading2Texts, setHeading2Texts] = useState<(string | null)[]>([]);

const route = useRouter()
    useEffect( () => {
       const getHeading2Elements = () => {
        const getHeading2Elements = document.querySelectorAll('h2');
        // const heading2Text = 
        const headings = Array.from(getHeading2Elements);
        const headingTexts = headings.map((heading) => heading.textContent);
        console.log("checkcheck",headings)
        setHeading2Texts(headingTexts)
       } 
       getHeading2Elements();
       
    },[])

    const handleClick = () => {

    }
  return (
    <div>
        {heading2Texts?.map(item=>(
            <div 
            onClick={()=>route.push(`#/${item}`)}
            key={item}>{item}</div>
        ))}
    </div>
  )
}

export default TableOfContent