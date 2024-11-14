'use client'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React, { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { FormError } from './FormError'
import { FormSuccess } from './FormSuccess'
import { Button } from '@/components/ui/button'
import { ContactSchema } from '@/schemas'

import { contact } from "@/actions/contact";
import { Textarea } from '@/components/ui/textarea'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ContactFromProps {
  btnColor?:string
} 

const ContactForm = ({btnColor}:ContactFromProps) => {
  const router = useRouter()

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const [isSuccessLabel, setIsSuccessLabel] = useState<boolean>(false);

  const form = useForm<z.infer<typeof ContactSchema>>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: ""
    }
  })

  const onSubmit = (values: z.infer<typeof ContactSchema>) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      console.log(values)
      contact(values)
        .then((data) => {
          setError(data.error)
          setSuccess(data.success)

          if(data.error === undefined) {
            toast.success(data.success)
          } else {
            toast.warning(data.error)
          }
        })
        .catch(() => setError('Đã có lỗi, vui lòng thử lại sau!'))
        .finally (()=> {
          setIsSuccessLabel(true)
          form.reset();
          router.refresh();
        })
    })
  }
  return (
    <div className=' bg-white w-full lg:w-10/12 h-[550px] p-5 rounded-md shadow-md flex flex-col justify-center gap-5'>
      <h2 className='text-center font-[700] text-2xl text-primary'>Đăng ký tư vấn</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <>
                <FormItem className='my-5'>
                  <FormControl className='h-[50px]'>
                    <Input
                      className='w-full bg-neutral-100 border-none focus:ring-0 rounded-sm text-neutral-500'
                      type='text'
                      placeholder='Họ và tên'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

              </>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <>
                <FormItem className='my-5'>
                  <FormControl className='h-[50px]'>
                    <Input
                      className='w-full bg-neutral-100 border-none focus:ring-0 rounded-sm text-neutral-500'
                      type='text'
                      placeholder='Email'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />
          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <>
                <FormItem className='my-5'>
                  <FormControl className='h-[50px]'>
                    <Input
                      className='w-full bg-neutral-100 border-none focus:ring-0 rounded-sm text-neutral-500'
                      type='text'
                      placeholder='Điện thoại'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </>
            )}
          />

          <FormField
            control={form.control}
            name='message'
            render={({ field }) => (
              <>
                <FormItem className='my-5'>
                  <FormControl className='h-[50px]'>
                    <Textarea
                      {...field}
                      placeholder='Vui lòng để lại yêu cầu của bạn!'
                      className='border-0 focus:ring-0 bg-neutral-100 text-neutral-500'
                    />

                  </FormControl>
                  <FormMessage className='text-destructive' />
                </FormItem>
              </>
            )}
          />

          <div className='my-3'>

            {error ? <FormError message={error} /> : success ? <FormSuccess message={success} /> : null}
          </div>

          <Button
            disabled={isPending}
            type='submit'
            className={`mt-5 w-full h-[60px] bg-secondary rounded-sm hover:bg-primary text-white duration-500 ${btnColor}`}
            
          >
            {isSuccessLabel ? "XIN CÁM ƠN!" : "GỬI YÊU CẦU"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default ContactForm