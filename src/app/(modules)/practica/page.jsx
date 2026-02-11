'use client';
import { LinkIcon } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';

export default function Page() {
  const pathname = usePathname();
    return(
        <main className="flex min-h-screen flex-col p-6">
            
            <div className="flex h-20 items-end rounded-lg bg-blue-500 p-4 md:h-52">
                <Link
                 href={'/dasboard/sales'}
                 className={clsx(                    'flex h-[48px] items-center justify-center gap-2 rounded-md bg-gray-50 p-3  text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3 '
   ,{
                'bg-sky-100 text-blue-600': pathname.includes('practica'),
              },
    
                )}
                    >
                    <LinkIcon className='"w-6'/>
                    <p className='hidden md:block'>test</p>
                </Link>
               <Image
                  src="/presentation.png"
                  width={560}
                  height={620}
                  alt="Hero Image"
                  className="hidden md:block object-contain"
               />
            </div>
        </main>
    );
}