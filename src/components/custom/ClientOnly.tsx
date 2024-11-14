'use client'
interface ClientOnlyProps {
    children:React.ReactNode;
}
const ClientOnly = ({children}:ClientOnlyProps) => {
  return (
    <div>{children}</div>
  )
}

export default ClientOnly