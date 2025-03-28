import request, { gql } from "graphql-request"

const MASTER_URL = "https://ap-south-1.cdn.hygraph.com/content/cm482x6a502j207w6ujty7gg4/master"

const getAllCourseList = async () => {
  const query = gql`
    
    query MyQuery {
  courses {
    description
    id
    isfree
    nameofcourse
    price
    color    
    nicknameforcourse

  }
}

    `

  const result = await request(MASTER_URL, query)
  return result
}
const getcourseinfo = async (courseid) => {
  const query2 = gql`
    query MyQuery {
  course(where: {nicknameforcourse: "`+ courseid + `"}) {
  
  
  nameofcourse
    price
    description
    color
    isfree
    nicknameforcourse
    
    quiz {
      id
      quiztitle
    }
    chapterMood {
      linkOfVideo
      nameofchapter
    }
  }
}
  `

  const result2 = await request(MASTER_URL, query2)
  return result2

}

const sendEnrollData = async (courseid, userEmail, phonenumber) => {
  const query3 = gql`
  
  mutation MyMutation {
  createUserEnroll(
    data: {course: {connect: {nicknameforcourse: "`+ courseid + `"}}, isHePaid: false, userEmail: "` + userEmail + `", courseid: "` + courseid + `", phonenumber: "` + phonenumber + `"}

  ) {
    id
    course {
      nameofcourse
    }
    stage
  }
     publishManyUserEnrollsConnection(first: 1000) {
    edges {
      node {
        id
      }
    }
  }
}
  
  `


  const result3 = await request(MASTER_URL, query3)
  return result3
}

const EnrollmentUsers = async (userEmail) => {
  const query4 = gql`
  query MyQuery {
  userEnrolls(where: {userEmail: "`+ userEmail + `", isHePaid: true}) {
    isHePaid
    phonenumber
    id
    courseid
    userEmail
    course {
      nameofcourse
      nicknameforcourse
      price
      color
      dataofcourse
      description
      isfree
      
    }
  }
}
  `

  const result4 = await request(MASTER_URL, query4)
  return result4;
}

const getQuizDataWithEnroll = async (userEmail, quizId) => {

  const query5 = gql`
  query MyQuery {
  userEnrolls(
    where: {userEmail: "`+ userEmail + `", isHePaid: true, course: {quiz_every: {id: "` + quizId + `"}}}
  ) {
    id
    courseid
    userEmail
    course {
      quiz(where: {id: "`+ quizId + `"}) {
        quiztitle
        question {
          opationA
          opationB
          opationD
          opationC
          qus
          trueChoisevip
        }
      }
    }
  }
}
  
  `
  const result5 = await request(MASTER_URL, query5)
  return result5

}

const SaveGradesOfQuiz = async (userEmail, uerName, userGrade, quizname, numofqus) => {
  const query6 = gql`
  
  mutation MyMutation {
  createQuizresult(
    data: {userEmail: "`+ userEmail + `", userName: "` + uerName + `", quizGrade: ` + userGrade + `,nameofquiz: "` + quizname + `",numofqus:` + numofqus + `}
  ) {
    id
  }

  
  
  publishManyQuizresultsConnection (first: 10000) {
    edges {
      node {
        id
      }
    }
  }
}
  `

  const reslut6 = await request(MASTER_URL, query6)
  return reslut6
}

const vquiz = async (userEmail) => {
  const qmon = gql`
  
  
query MyQuery {
  quizresults(where: {userEmail: "`+ userEmail + `"}) {
    id
    quizGrade
    userName
    nameofquiz
    numofqus
  }
}

  `

  const quizres = await request(MASTER_URL, qmon)
  return quizres;
}

const data4admin = async () => {
  const dataa4admin = gql`
  
  query MyQuery  {
  userEnrolls (first: 1000) {
    userEmail
    courseid
    course {
      price
      updatedAt
    }
    isHePaid
    id
  }
}
  `

  const admindata = await request(MASTER_URL, dataa4admin)
  return admindata
}

const editStateSub = async (idofEnroll, ActiveOrDeactive) => {
  const query9 = gql`
  mutation MyMutation {
  updateUserEnroll(
    data: {isHePaid: `+ ActiveOrDeactive + `}
    where: {id: "`+ idofEnroll + `"}

  ) {
    id
  }
    
  publishManyUserEnrollsConnection(first: 1000) {
    edges {
      node {
        id
      }
    }
  }
}
  



`

  const state4 = await request(MASTER_URL, query9)
  return state4;


}

const publishEnrolls = async () => {
  const wie = gql`
   mutation MyMutation {
  publishManyUserEnrollsConnection {
    edges {
      node {
        id
      }
    }
  }
}
    `

  const back = await request(MASTER_URL, wie)
  return back
}

const sendEnroll4Admin = async (courseid,email) => {
  const wie = gql`
 
  mutation MyMutation {
  createUserEnroll(
    data: {course: {connect: {nicknameforcourse: "`+courseid+`"}}, userEmail: "`+email+`", isHePaid: true, phonenumber: "010", courseid: "`+courseid+`"}
  ) {
    id
  }
  publishManyUserEnrollsConnection(first: 1000) {
    edges {
      node {
        id
      }
    }
  }
}

   `

  const back = await request(MASTER_URL, wie)
  return back
}
export default {
  sendEnroll4Admin,
  getAllCourseList,
  getcourseinfo,
  sendEnrollData,
  EnrollmentUsers,
  getQuizDataWithEnroll,
  SaveGradesOfQuiz,
  vquiz,
  data4admin,
  editStateSub,
  publishEnrolls


}