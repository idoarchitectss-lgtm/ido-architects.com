import Link from 'next/link';
interface ListItem {
    title:string;
    link:string;
    className?:string;
}

const ListItem:React.FC<ListItem> = ({
    title,
    link,
    className
}) => {
  return (
    <div>
        <Link className={` text-sm font-medium hover:text-secondary duration-200 ${className}`}
        href={link}
        >{title}</Link>
    </div>
  )
}

export default ListItem