
"use client"

import axios from "axios"
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"

import { UserDetailsContext } from "@/context/UserDetails"
import { SelectedChapterIndex } from "@/context/SelectedChapterIndex"

function Provider({ children }) {

  const { user } = useUser();

  const [userDetail, setuserDetail] = useState();
  const [selectedChapterIndex, setSelectedChapterIndex] = useState(0);

  const CreateNewUser = async () => {

    try {

      const result = await axios.post('/api/user', {
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress
      })

      console.log(result.data)

      setuserDetail(result.data)

    } catch (error) {
      console.log("API ERROR", error)
    }
  }

  useEffect(() => {

    if (user) {
      CreateNewUser();
    }

  }, [user])

  return (

    <UserDetailsContext.Provider
      value={{ userDetail, setuserDetail }}
    >

      <SelectedChapterIndex.Provider
        value={{
          selectedChapterIndex,
          setSelectedChapterIndex
        }}
      >

        {children}

      </SelectedChapterIndex.Provider>

    </UserDetailsContext.Provider>
  )
}

export default Provider

