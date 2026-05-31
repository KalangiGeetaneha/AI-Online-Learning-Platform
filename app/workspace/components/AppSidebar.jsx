"use client"

import React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

import {
  Book,
  Compass,
  LayoutDashboard,
  PencilRulerIcon,
  UserCircle2Icon,
  WalletCards
} from 'lucide-react'

import { usePathname } from 'next/navigation'
import AddNewCourseDialog from './AddNewCourseDialog'

const SideBarOptions = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/workspace'
  },
  {
    title: 'My Learning',
    icon: Book,
    path: '/workspace/my-learning'
  },
  {
    title: 'Explore Courses',
    icon: Compass,
    path: '/workspace/explore'
  },
  
  {
    title: 'Billing',
    icon: WalletCards,
    path: '/workspace/billing'
  },
  {
    title: 'Profile',
    icon: UserCircle2Icon,
    path: '/workspace/profile'
  }
]

function AppSidebar() {

  const path = usePathname();

  return (
    <Sidebar>

      <SidebarHeader className='p-4'>

        <Image
          src='/logo.svg'
          alt='logo'
          width={200}
          height={200}
        />

      </SidebarHeader>

      <SidebarContent>

        <SidebarGroup>

         <AddNewCourseDialog>
          <Button className='w-full'>
            Create New Course
          </Button>
          </AddNewCourseDialog>

        </SidebarGroup>

        <SidebarGroup>

          <SidebarGroupContent>

            <SidebarMenu>

              {SideBarOptions.map((item, index) => (

                <SidebarMenuItem key={index}>

                  <SidebarMenuButton
                    asChild
                    className='p-5'
                  >

                    <Link
                      href={item.path}
                      className={`
                        flex items-center gap-3 text-[17px]
                        ${path === item.path
                          ? 'text-primary bg-purple-100'
                          : ''
                        }
                      `}
                    >

                      <item.icon className='w-5 h-5' />

                      <span>{item.title}</span>

                    </Link>

                  </SidebarMenuButton>

                </SidebarMenuItem>

              ))}

            </SidebarMenu>

          </SidebarGroupContent>

        </SidebarGroup>

      </SidebarContent>

      <SidebarFooter />

    </Sidebar>
  )
}

export default AppSidebar