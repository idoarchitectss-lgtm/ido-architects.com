'use client'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React, { useEffect, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { FormError } from './FormError'
import { FormSuccess } from './FormSuccess'
import { Button } from '@/components/ui/button'
import { ContactSchema } from '@/schemas'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Contact, Contact2Icon, MailIcon, Quote } from 'lucide-react'

interface ServiceOption {
  id: string;
  title: string;
}

interface ContactFromProps {
  btnColor?: string;
  labelOfForm: string
}

const ContactForm = ({ btnColor, labelOfForm }: ContactFromProps) => {
  const router = useRouter()

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>('');
  const [isPending, startTransition] = useTransition();
  const [services, setServices] = useState<ServiceOption[]>([]);

  useEffect(() => {
    fetch('/api/services?size=100')
      .then((r) => r.json())
      .then((data) => setServices(data.services ?? []))
      .catch(() => setServices([]));
  }, []);

  const form = useForm<z.infer<typeof ContactSchema>>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      serviceId: undefined
    }
  })

  const onSubmit = (values: z.infer<typeof ContactSchema>) => {
    setError('')
    setSuccess('')

    startTransition(async () => {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(values),
        });

        const result = await response.json();

        if (response.ok && result?.success) {
          setSuccess(result.success);
          form.reset();
          toast.success(result.success);
        } else {
          const errMsg = result?.error || 'Gửi yêu cầu thất bại. Vui lòng thử lại!';
          setError(errMsg);
          toast.error(errMsg);
        }
      } catch (error) {
        const errMsg = 'Đã xảy ra lỗi kết nối. Vui lòng thử lại!';
        setError(errMsg);
        toast.error(errMsg);
      }
    })
  }
  return (
    <div className='bg-neutral-100 shadow-md rounded-md relative w-full h-fit p-5 flex flex-col justify-center '>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}
          className=''
        >
          <div className='flex flex-row justify-center items-center gap-2  py-2 mx-auto  w-11/12 '>
            <h2 className='text-center text-3xl font-bold '>{labelOfForm}</h2>
          </div>
          {/* họ và tên */}
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <>
                <FormItem className='my-5'>
                  <FormControl className='h-[50px]'>
                    <Input
                      className='w-full bg-white border-none focus:ring-0 rounded-none text-neutral-500'
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
                      className='w-full bg-white  border-none focus:ring-0 rounded-none  text-neutral-500'
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
                      className='w-full bg-white border-none focus:ring-0 rounded-none  text-neutral-500'
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

          {/* Dropdown Service list */}
          <FormField
            control={form.control}
            name='serviceId'
            render={({ field }) => (
              <>
                <FormItem className='my-5'>
                  <FormControl className='h-[50px]'>
                    <Select value={field.value} onValueChange={field.onChange} disabled={services.length === 0}>
                      <SelectTrigger className='w-full bg-white border-none focus:ring-0 rounded-none text-neutral-500 h-[50px]'>
                        <SelectValue placeholder={services.length === 0 ? 'Hiện chưa có gói dịch vụ' : 'Gói dịch vụ quan tâm (không bắt buộc)'} />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      className='border-0 focus:ring-0  rounded-none bg-white text-neutral-500'
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
            variant={'cta'}
            className='w-full font-bold text-lg tracking-widest py-7 flex flex-row items-center gap-2'
          >
            <span>GỬI YÊU CẦU</span>
            <MailIcon />
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default ContactForm