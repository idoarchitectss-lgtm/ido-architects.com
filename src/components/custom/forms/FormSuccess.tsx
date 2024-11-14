import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Send } from "lucide-react";

interface FormSuccessProps {
    message?:string;
};

export const FormSuccess = ({message}:FormSuccessProps) => {
    return(
        <div className="bg-primary/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-green-500">
        <Send className="h-4 w-4" />
        <p>{message}</p>
    </div>
    )
}