'use client'
import { NewsletterSchema } from '@/schemas'
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Send } from 'lucide-react'
import { FormError } from './FormError'
import { FormSuccess } from './FormSuccess'
import { Button } from '@/components/ui/button'
import { newsletter } from '@/actions/newsLetter'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const NewsletterForm = () => {

  const router = useRouter()
  
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewsletterSchema>>({
    resolver: zodResolver(NewsletterSchema),
    defaultValues: {
      email: "",
    }
  });

  const onSubmit = (values: z.infer<typeof NewsletterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(()=> {
      console.log(error)

      newsletter(values)
      .then((data)=> {
        console.log(values)
        setSuccess(data.success)
        setError(data.error)

        console.log('check error', data.error)
        console.log('check success', data.success)
        if(data.error === undefined ) {
          toast.success(data.success)
        } else {
          toast.warning(data.error)
        }
        form.reset()
      })
      .catch(()=> setError("Đã xảy ra lỗi, vui lòng thử lại sau!"))
      .finally(()=> {
        router.refresh()
      })
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='email'
          render={({field}) => (
            <FormItem className='flex flex-col md:flex-row items-center justify-around gap-5 w-full'>
              <FormLabel className='flex items-center justify-around text-2xl mt-5'>Đăng ký nhận bài viết mới nhất</FormLabel>
              <div className='flex flex-row h-[50px] my-5 w-full md:w-6/12 xl:w-4/12'>
                <FormControl className='h-full '>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder='Điền email vào đây'
                    className='dark:bg-transparent/90 dark:text-white bg-white text-black'
                  />
                </FormControl>
                {/* <div className=' bg-primary px-4 py-4 w-4/12 text-center cursor-pointer -translate-x-3 rounded-r-md h-full '>
                  <p className='font-bold text-sm'>Đăng Ký</p>
                </div> */}
                <Button
                disabled={isPending}
                type='submit'
                className=' bg-primary text-white w-4/12 p-2 px-4 cursor-pointer -translate-x-3 rounded-r-md rounded-l-none h-full hover:bg-primary hover:-translate-x-2 duration-300'
                >
                <Send strokeWidth={1} className='' />
                </Button>
              </div>
              {/* {error ? <FormError classNames="text-white" message={error} /> : success ? <FormSuccess message={success}/> : null} */}
              
              <FormMessage className='text-white'/>
            </FormItem>
          )}
        />
      </form>

    </Form>



  )
}

export default NewsletterForm