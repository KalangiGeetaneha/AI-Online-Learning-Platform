import React from 'react'
import WelcomeBanner from '../WelcomeBanner'
import EnrollCourseList from '../edit-course/[courseId]/_components/EnrollCourseList'

const MyLearning = () => {
  return (
    <div>
        <WelcomeBanner/>
        <h2 className='font-bold text-2xl mt-5'>My Learning</h2>
        <EnrollCourseList/>

    </div>
  )
}

export default MyLearning