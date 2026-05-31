import React from 'react'
import WelcomeBanner from './WelcomeBanner'
import CourseList from './components/CourseList'
import EnrollCourseList from './edit-course/[courseId]/_components/EnrollCourseList'


function Workspace ()  {
  return (
    <div>
        <WelcomeBanner/>
        <EnrollCourseList/>
        <CourseList/>
    </div>
  )
}

export default Workspace