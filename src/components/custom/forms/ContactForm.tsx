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

import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface ContactFromProps {
  btnColor?: string;
  labelOfForm:string
}

const ContactForm = ({ btnColor,labelOfForm }: ContactFromProps) => {
  const router = useRouter()

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();

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

    startTransition(async () => {
    console.log(values)
    try {
      const response = await fetch('https://ido-architects.io/wp-json/wp/v2/contact_submission', {
        method:'POST',
        headers: {
          "Content-Type":"application/json"
        },
        body:JSON.stringify(values),
      });

      const result = await response.json();

      if (response.ok) {
        if (result?.success) {
            setSuccess(result.success || 'Gửi thông tin thành công');
            form.reset();
            toast.success(result.success || 'Gửi yêu cầu thanh cong');
        } else {
          toast.error(result?.error || 'Gửi yêu cầu thất bại. Vui lòng thử lại!');
            throw new Error(result?.error || 'Gửi yêu cầu đã xảy ra lỗi');
        }
    } else {
        throw new Error('Failed to submit form. Please try again later.');
    }
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    }
    })
  }
  return (
    <div className='bg-neutral-100 relative w-full lg:w-10/12 h-[550px] p-5  flex flex-col justify-center '>
      <div className='absolute top-5 left-5 flex flex-row justify-center items-center gap-2 border-[1px] border-neutral-300 shadow-xl py-2 mx-auto bg-neutral-800  text-white w-11/12 '>
        <h2 className='text-center font-[500] text-2xl '>{labelOfForm}</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}
        className=''
        > 
          {/* họ và tên */}
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <>
                <FormItem className='my-5'>
                  <FormControl className='h-[50px]'>
                    <Input
                      className='w-full bg-white border-none focus:ring-0 shadow-sm rounded-none text-neutral-500'
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
          {/* Email */}
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <>
                <FormItem className='my-5'>
                  <FormControl className='h-[50px]'>
                    <Input
                      className='w-full bg-white  border-none focus:ring-0 rounded-none shadow-xl text-neutral-500'
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
          {/* Phone */}
          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <>
                <FormItem className='my-5'>
                  <FormControl className='h-[50px]'>
                    <Input
                      className='w-full bg-white border-none focus:ring-0 rounded-none shadow-xl text-neutral-500'
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
                      className='border-0 focus:ring-0 shadow-xl rounded-none bg-white text-neutral-500'
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
            className='bg-secondary w-full text-white hover:bg-secondary/90 border-none '
          >
            <span className='tracking-wide'>LIÊN HỆ TƯ VẤN</span>
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default ContactForm