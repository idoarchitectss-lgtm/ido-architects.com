import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchFormProps {
  placeholder?: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  defaultValue?: string,
  // onBlur: () => void
}
const SearchDialog: React.FC<SearchFormProps> = ({
  placeholder,
  onChange,
  defaultValue,
  // onSubmit,
  // onBlur

}) => {
  return (
    <form
      className="relative flex w-full mx-auto ">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <Input
        className="peer block w-full rounded-lg border-[1px] py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500  shadow-md"
        placeholder={placeholder}
        onChange={onChange}
        defaultValue={defaultValue}
      /**Để đảm bảo trường đầu vào được đồng bộ hóa với URL và sẽ được điền khi chia sẻ, bạn có thể chuyển sang defaultValueđầu vào bằng cách đọc từ searchParams */
      />
      <Search className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-secondary/80 peer-focus:text-gray-secondary  " />
    </form>
  )
}

export default SearchDialog;