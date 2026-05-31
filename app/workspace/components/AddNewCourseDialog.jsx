"use client"

import React, { useState } from 'react'
import axios from 'axios'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
 DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'

import { Loader2Icon, Sparkles } from 'lucide-react'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

function AddNewCourseDialog({ children }) {

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    includeVideo: false,
    noOfChapters: 1,
    category: '',
    level: ''
  });

  const router = useRouter();

  // Generate Course
  const onGenerate = async () => {

    try {

      console.log(formData);

      setLoading(true);

      const result = await axios.post(
        '/api/generate-course-layout',
        {
          ...formData
        }
      );

      console.log(result.data);

      // Limit Exceeded
      if (result.data?.resp === 'limit exceed') {

        toast.warning('Please subscribe to plan!');

        router.push('/workspace/billing');

        return;
      }

      // Success
      toast.success('Course Generated Successfully');

      router.push(
        '/workspace/edit-course/' +
        result.data?.courseId
      );

    } catch (error) {

      console.log(error);

      // 403 Error
      if (error?.response?.status === 403) {

        toast.warning('Please subscribe to plan!');

        router.push('/workspace/billing');

      } else {

        toast.error('Something went wrong');
      }

    } finally {

      setLoading(false);
    }
  }

  // Handle Inputs
  const onHandleInputChange = (field, value) => {

    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  }

  return (

    <Dialog>

      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] rounded-2xl">

        <DialogHeader>

          <DialogTitle className="text-2xl font-bold">
            Create New Course Using AI
          </DialogTitle>

          <DialogDescription asChild>

            <div className='flex flex-col gap-5 mt-5'>

              {/* Course Name */}
              <div className='space-y-2'>

                <label className='font-medium'>
                  Course Name
                </label>

                <Input
                  placeholder='Course Name'
                  className='h-11 rounded-xl'
                  onChange={(e) =>
                    onHandleInputChange(
                      'name',
                      e.target.value
                    )
                  }
                />

              </div>

              {/* Description */}
              <div className='space-y-2'>

                <label className='font-medium'>
                  Course Description
                </label>

                <Input
                  placeholder='Enter course description'
                  className='h-11 rounded-xl'
                  onChange={(e) =>
                    onHandleInputChange(
                      'description',
                      e.target.value
                    )
                  }
                />

              </div>

              {/* Chapters */}
              <div className='space-y-2'>

                <label className='font-medium'>
                  No. Of Chapters
                </label>

                <Input
                  placeholder='Enter number of chapters (number)'
                  type='number'
                  className='h-11 rounded-xl'
                  onChange={(e) =>
                    onHandleInputChange(
                      'noOfChapters',
                      e.target.value
                    )
                  }
                />

              </div>

              {/* Include Video */}
              <div className='flex items-center justify-between border rounded-xl p-4'>

                <div>

                  <h2 className='font-medium'>
                    Include Video Lessons
                  </h2>

                  <p className='text-sm text-gray-500'>
                    AI will generate video references
                  </p>

                </div>

                <Switch
                  checked={formData.includeVideo}
                  onCheckedChange={(value) =>
                    onHandleInputChange(
                      'includeVideo',
                      value
                    )
                  }
                />

              </div>

              {/* Difficulty */}
              <div className='space-y-2'>

                <label className='font-medium'>
                  Difficulty Level
                </label>

                <Select
                  onValueChange={(value) =>
                    onHandleInputChange(
                      'level',
                      value
                    )
                  }
                >

                  <SelectTrigger className="w-full h-11 rounded-xl">

                    <SelectValue placeholder="Select Difficulty" />

                  </SelectTrigger>

                  <SelectContent>

                    <SelectGroup>

                      <SelectItem value="Beginner">
                        Beginner
                      </SelectItem>

                      <SelectItem value="Intermediate">
                        Intermediate
                      </SelectItem>

                      <SelectItem value="Advanced">
                        Advanced
                      </SelectItem>

                    </SelectGroup>

                  </SelectContent>

                </Select>

              </div>

              {/* Category */}
              <div className='space-y-2'>

                <label className='font-medium'>
                  Category
                </label>

                <Input
                  placeholder='Provide Category (web development,..)'
                  className='h-11 rounded-xl'
                  onChange={(e) =>
                    onHandleInputChange(
                      'category',
                      e.target.value
                    )
                  }
                />

              </div>

              {/* Button */}
              <Button
                className='mt-4 w-full h-11 rounded-xl'
                onClick={onGenerate}
                disabled={loading}
              >

                {loading ? (
                  <Loader2Icon className='animate-spin' />
                ) : (
                  <Sparkles />
                )}

                {loading
                  ? 'Generating...'
                  : 'Generate Course'}

              </Button>

            </div>

          </DialogDescription>

        </DialogHeader>

      </DialogContent>

    </Dialog>
  )
}

export default AddNewCourseDialog