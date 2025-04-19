import request, { gql } from "graphql-request"

const MASTER_URL = "https://ap-south-1.cdn.hygraph.com/content/cm482x6a502j207w6ujty7gg4/master"

const getAllCourseList = async () => {
  const query = gql`
    query GetAllCourses {
      courses {
        id
        nameofcourse
        description
        price
        isfree
        nicknameforcourse
        updatedAt
        dataofcourse
        isDraft
      }
    }
  `;

  const result = await request(MASTER_URL, query);
  return result;
};

const getcourseinfo = async (courseid) => {
  try {
    const query2 = gql`
      query GetCourse {
        course(where: {nicknameforcourse: "${courseid}"}) {
          nameofcourse
          price
          description
          
          isfree
          nicknameforcourse
           
          
        }
      }
    `;

    const result = await request(MASTER_URL, query2);

    if (!result.course) {
      console.log('Course not found:', courseid);
      return { course: null };
    }

    return result;
  } catch (error) {
    console.error('Error fetching course:', error);
    return { course: null }; // Return null course instead of throwing
  }
};
 

const getQuizDataWithEnroll = async (userEmail, quizId) => {
  const query5 = gql`
  query MyQuery {
    userEnrolls(where: {userEmail: "${userEmail}", isHePaid: true}) {
      id
      courseid
      userEmail
      course {
        exam(where: {id: "${quizId}"}) {
          title
          jsonexam
        }
      }
    }
  }
  `;
  const result5 = await request(MASTER_URL, query5);
  return result5;
};

const updateQuizResults = async (userEmail, userName, quizResult) => {
  const mutation = gql`
  mutation UpdateQuizResults {
    updateQuizresult(
      where: { id: "cm9e95c4x1c7j07o3v11kjod3" }
      data: { jsonReslut: """${JSON.stringify(quizResult)}""" }
    ) {
      id
    }
    publishQuizresult(where: { id: "cm9e95c4x1c7j07o3v11kjod3" }) {
      id
    }
  }
  `;

  return await request(MASTER_URL, mutation);
};

const getQuizResults = async () => {
  const query = gql`
    query GetQuizResults {
      quizresult(where: { id: "cm9e95c4x1c7j07o3v11kjod3" }) {
        jsonReslut
      }
    }
  `;

  try {
    const result = await request(MASTER_URL, query);
    return JSON.parse(result.quizresult?.jsonReslut || '{"results": []}');
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return { results: [] };
  }
};

const SaveGradesOfQuiz = async (userEmail, userName, userGrade, quizname, numofqus, jsonResult = null) => {
  try {
    // Get existing results first
    const existingData = await getQuizResults();
    const currentResults = existingData?.results || [];

    // Prepare new result
    const newResult = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userEmail,
      userName,
      quizGrade: userGrade,
      nameofquiz: quizname,
      numofqus: numofqus,
      submittedAt: new Date().toISOString(),
      ...(jsonResult || {})
    };

    // Update results array
    const updatedData = {
      results: [...currentResults, newResult]
    };

    // Save updated results
    const response = await updateQuizResults(userEmail, userName, updatedData);

    if (!response?.updateQuizresult?.id) {
      throw new Error('Failed to update quiz results');
    }

    return response;
  } catch (error) {
    console.error('Error in SaveGradesOfQuiz:', error);
    throw new Error('Failed to save quiz results');
  }
};

// Update getQuizJsonResult to use centralized storage
const getQuizJsonResult = async (email) => {
  try {
    const allResults = await getQuizResults();
    const userResults = allResults.results.filter(result => result.userEmail === email);
    return { quizresults: userResults };
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    return { quizresults: [] };
  }
};

const data4admin = async () => {
  const dataa4admin = gql`
  query MyQuery {
    userEnrolls(first: 1000, orderBy: updatedAt_DESC) {
      userEmail
      courseid
      course {
        price
        updatedAt
      }
      isHePaid
      id
      updatedAt
      createdAt
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

const getNotifications = async () => {
  const query = gql`
    query GetNotifications {
      notifictions {
        id
        message
        updatedAt
      }
    }
  `;

  const result = await request(MASTER_URL, query);
  return { notifications: result.notifictions || [] };
};

const createNotification = async (notification) => {
  const mutation = gql`
    mutation CreateNotification {
      createNotifiction(
        data: {
          message: "${notification.message}"
        }
      ) {
        id
      }
      publishManyNotifictionsConnection {
        edges {
          node {
            id
          }
        }
      }
    }
  `;

  return await request(MASTER_URL, mutation);
};

const updateNotification = async (id, notification) => {
  const mutation = gql`
    mutation UpdateNotification {
      updateNotifiction(
        where: { id: "${id}" }
        data: {
          message: "${notification.message}"
        }
      ) {
        id
      }
      publishNotifiction(where: { id: "${id}" }) {
        id
      }
    }
  `;

  return await request(MASTER_URL, mutation);
};

const deleteNotification = async (id) => {
  const mutation = gql`
    mutation DeleteNotification {
      deleteNotifiction(where: { id: "${id}" }) {
        id
      }
    }
  `;

  return await request(MASTER_URL, mutation);
};

const sendEnroll4Admin = async (courseid, email) => {
  const wie = gql`
 
  mutation MyMutation {
  createUserEnroll(
    data: {course: {connect: {nicknameforcourse: "`+ courseid + `"}}, userEmail: "` + email + `", isHePaid: true, phonenumber: "010", courseid: "` + courseid + `"}

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

const sendExamData = async (formattedData, examTitle) => {
  const escapedData = formattedData.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const query = gql`
    mutation MyMutation {
      createExam(
        data: {jsonexam: "${escapedData}", title: "${examTitle}"}
      ) {
        id
      }
    }
    publishManyExamsConnection(first: 1000) {
      edges {
        node {
          id
        }
      }
    }
  `;

  const result = await request(MASTER_URL, query);
  return result;
};


 

const getPaymentLogs = async () => {
  const query = gql`
    query GetPaymentLogs {
      userEnrolls(
        orderBy: createdAt_DESC
        where: {isHePaid: false}
      ) {
        id
        userEmail
        phonenumber
        createdAt
        course {
          nameofcourse
          price
        }
      }
    }
  `;

  const result = await request(MASTER_URL, query);
  return result;
};

const sendquiz = async (title, jsonData) => {
  try {
    // Ensure the JSON is properly escaped for GraphQL
    const escapedJson = jsonData.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

    const query = gql`
      mutation CreateQuiz {
        createExam(data: {
          title: "${title}",
          jsonexam: "${escapedJson}"
        }) {
          id
        }
        publishManyExamsConnection(first: 1000) {
    edges {
      node {
        id
      }
    }
  }
      }
    `;

    const result = await request(MASTER_URL, query);
    return result;
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw new Error(error.message || 'Failed to create quiz');
  }
};

const getAllExams = async () => {
  const query = gql`
    query GetAllExams {
      exams {
        id
        title
        jsonexam
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

const updateExam = async (examId, title, jsonData) => {
  const escapedJson = jsonData.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const query = gql`
    mutation UpdateExam {
      updateExam(
        where: { id: "${examId}" }
        data: { title: "${title}", jsonexam: "${escapedJson}" }
      ) {
        id
      }
      publishExam(where: { id: "${examId}" }) {
        id
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

const getActivationData = async () => {
  const query = gql`
    query GetPaymentLogs {
      actvition(where: {id: "cm9ebuavq1dxx07pmynhukjm7"}) {
        activit
        id
      }
    }
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

const updateActivationData = async (newData) => {
  const mutation = gql`
    mutation UpdateActivation {
      updateActvition(
        where: { id: "cm9ebuavq1dxx07pmynhukjm7" }
        data: { activit: """${JSON.stringify(newData)}""" }
      ) {
        id
      }
      publishActvition(where: { id: "cm9ebuavq1dxx07pmynhukjm7" }) {
        id
      }
    }
  `;
  return await request(MASTER_URL, mutation);
};

const saveNewActivation = async (userData) => {
  try {
    const existingData = await getActivationData();
    let activations = [];

    try {
      activations = JSON.parse(existingData.actvition?.activit || '[]');
    } catch (e) {
      activations = [];
    }

    const newActivation = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...userData,
    };

    activations.push(newActivation);
    await updateActivationData(activations);
    return newActivation;
  } catch (error) {
    console.error('Error saving activation:', error);
    throw error;
  }
};

const updateActivationStatus = async (activationId, newStatus) => {
  try {
    const existingData = await getActivationData();
    let activations = JSON.parse(existingData.actvition?.activit || '[]');

    const updatedActivations = activations.map(activation =>
      activation.id === activationId
        ? { ...activation, status: newStatus, updatedAt: new Date().toISOString() }
        : activation
    );

    await updateActivationData(updatedActivations);
    return true;
  } catch (error) {
    console.error('Error updating activation status:', error);
    throw error;
  }
};

const checkUserEnrollment = async (userEmail, courseId) => {
  try {
    // First get activation data
    const activationData = await getActivationData();
    if (!activationData?.actvition?.activit) {
      console.log('No activation data found');
      return false;
    }

    const activations = JSON.parse(activationData.actvition.activit || '[]');

    // Check if user has an approved activation for this course
    const hasApprovedActivation = activations.some(
      activation =>
        activation.userEmail === userEmail &&
        activation.courseId === courseId &&
        activation.status === 'approved'
    );

    console.log('Enrollment check:', { userEmail, courseId, hasAccess: hasApprovedActivation });
    return hasApprovedActivation;
  } catch (error) {
    console.error('Error checking enrollment:', error);
    return false;
  }
};

const addManualActivation = async (activationData) => {
  try {
    // Get existing activations
    const existingData = await getActivationData();
    let activations = [];

    try {
      activations = JSON.parse(existingData.actvition?.activit || '[]');
    } catch (e) {
      activations = [];
    }

    // Create new activation object
    const newActivation = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...activationData,
      status: 'approved'  // Manual activations are approved by default
    };

    // Add to activations array
    activations.push(newActivation);

    // Update the database
    await updateActivationData(activations);
    return newActivation;
  } catch (error) {
    console.error('Error adding manual activation:', error);
    throw error;
  }
};

const addQuiz = async (courseData) => {
  const {
    videoLink = "",
    chapterName = "",
    examTitle = "",
    examJson = "",
    courseName = "",
    courseNickname = "",
    price = 10,
    isFree = false,
    courseDate = new Date().toISOString()
  } = courseData;

  const query = gql`
    mutation CreateCourse {
      createCourse(
        data: { 
           
          isfree: ${isFree},
          nameofcourse: "${courseName}",
          nicknameforcourse: "${courseNickname}",
          price: ${price},
          updatedAt: "${courseDate}",
          dataofcourse: "${courseDate}"
        }
      ) {
        id
        nameofcourse
      }
      publishManyCoursesConnection {
        edges {
          node {
            id
          }
        }
      }
    }
  `;

  const result = await request(MASTER_URL, query);
  return result;
};

const createCourse = async (courseData) => {
  // Escape strings to prevent GraphQL syntax errors
  const escapedTitle = courseData.nameofcourse.replace(/"/g, '\\"');
  const escapedDesc = courseData.description.replace(/"/g, '\\"');
  const escapedNickname = courseData.nicknameforcourse.replace(/"/g, '\\"');

  // Create chapters array for mutation
  const chaptersData = courseData.chapters.map(ch => ({
    nameofchapter: ch.nameofchapter.replace(/"/g, '\\"'),
    linkOfVideo: ch.linkOfVideo.replace(/"/g, '\\"')
  }));

  // Build the mutation string
  const mutation = gql`
    mutation CreateCourse {
      createCourse(
        data: {
          nameofcourse: "${escapedTitle}"
          description: "${escapedDesc}"
          price: ${courseData.price}
          isfree: ${courseData.isfree}
          dataofcourse: "${courseData.dataofcourse}"
          nicknameforcourse: "${escapedNickname}"
          isDraft: ${courseData.isDraft || false}
        
        }
      ) {
        id
        nameofcourse
      }
    }
  `;

  try {
    const result = await request(MASTER_URL, mutation);

    // After creating the course, publish it
    if (result?.createCourse?.id) {
      await request(MASTER_URL, gql`
        mutation PublishCourse {
          publishCourse(where: { id: "${result.createCourse.id}" }) {
            id
          }
        }
      `);
      await addChaptersForCourse(courseData.nicknameforcourse, courseData.chapters);
    }

    return result;
  } catch (error) {
    console.error('CreateCourse Error:', error);
    throw error;
  }
};

const updateCourse = async (courseId, courseData) => {
    try {
        if (!courseId) throw new Error('Course ID is required');

        // Escape special characters in strings
        const escapedTitle = courseData.nameofcourse?.replace(/"/g, '\\"') || '';
        const escapedDesc = courseData.description?.replace(/"/g, '\\"') || '';
        const escapedNickname = courseData.nicknameforcourse?.replace(/"/g, '\\"') || '';

        const mutation = gql`
            mutation UpdateCourse {
                updateCourse(
                    where: { id: "${courseId}" }
                    data: {
                        nameofcourse: "${escapedTitle}"
                        description: "${escapedDesc}"
                        price: ${Number(courseData.price) || 0}
                        isfree: ${Boolean(courseData.isfree)}
                        isDraft: ${Boolean(courseData.isDraft)}
                        nicknameforcourse: "${escapedNickname}"
                        dataofcourse: "${courseData.dataofcourse || new Date().toISOString().split('T')[0]}"
                    }
                ) {
                    id
                    nameofcourse
                    description
                    price
                    isfree
                    isDraft
                    nicknameforcourse
                    dataofcourse
                }
            }
        `;

        const result = await request(MASTER_URL, mutation);

        // Publish the updated course
        if (result?.updateCourse?.id) {
            await request(MASTER_URL, gql`
                mutation PublishCourse {
                    publishCourse(where: { id: "${courseId}" }) {
                        id
                    }
                }
            `);
        }

        return result;
    } catch (error) {
        console.error('Update course error:', error);
        throw error;
    }
};

// Initialize chapter data if not exists
const initializeChapterData = async () => {
  const mutation = gql`
    mutation InitializeChapter {
      createChapter(
        data: {
          chapterData: "{\"chapters\":[]}"
        }
      ) {
        id
      }
      publishChapter(where: { id: "cm9ffash61wgf07pmxchg9bl2" }) {
        id
      }
    }
  `;

  try {
    await request(MASTER_URL, mutation);
  } catch (error) {
    console.error('Chapter data already exists');
  }
};

const getChaptersData = async () => {
  const query = gql`
    query GetChapters {
      chpater(where: {id: "cm9ffash61wgf07pmxchg9bl2"}) {
        chapterData
      }
    }
  `;

  try {
    const result = await request(MASTER_URL, query);
    console.log('Raw chapter data:', result); // Debug log

    if (!result?.chpater?.chapterData) {
      console.log('No chapter data found, returning empty array');
      return { chapters: [] };
    }

    let parsedData;
    try {
      parsedData = JSON.parse(result.chpater.chapterData);
    } catch (e) {
      console.error('Error parsing chapter data:', e);
      return { chapters: [] };
    }

    return parsedData || { chapters: [] };
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return { chapters: [] };
  }
};

const updateChaptersData = async (newData) => {
  if (!newData || !newData.chapters) {
    console.error('Invalid chapter data format');
    return;
  }

  const mutation = gql`
    mutation UpdateChapters {
      updateChpater(
        where: { id: "cm9ffash61wgf07pmxchg9bl2" }
        data: { chapterData: ${JSON.stringify(JSON.stringify(newData))} }
      ) {
        id
      }
      publishChpater(where: { id: "cm9ffash61wgf07pmxchg9bl2" }) {
        id
      }
    }
  `;

  return await request(MASTER_URL, mutation);
};

const addChaptersForCourse = async (courseNickname, chapters) => {
  try {
    if (!Array.isArray(chapters)) {
      console.error('Chapters must be an array');
      return [];
    }

    const existingData = await getChaptersData();
    const currentChapters = existingData?.chapters || [];

    // Remove any existing chapters for this course
    const filteredChapters = currentChapters.filter(
      ch => ch.courseNickname !== courseNickname
    );

    // Add new chapters with order
    const newChapters = chapters.map((chapter, index) => ({
      title: chapter.nameofchapter || '',
      linkOfVideo: chapter.linkOfVideo || '',
      order: index + 1,
      courseNickname
    }));

    // Update the chapters array
    const updatedData = {
      chapters: [...filteredChapters, ...newChapters]
    };

    await updateChaptersData(updatedData);
    return newChapters;
  } catch (error) {
    console.error('Error adding chapters:', error);
    return [];
  }
};

const updateCourseChapters = async (courseNickname, chapters) => {
  try {
    const existingData = await getChaptersData();

    // Filter out chapters of the current course
    const otherChapters = existingData.chapters.filter(
      ch => ch.courseNickname !== courseNickname
    );

    // Add updated chapters
    const updatedChapters = chapters.map((chapter, index) => ({
      title: chapter.nameofchapter,
      linkOfVideo: chapter.linkOfVideo,
      order: index + 1,
      courseNickname
    }));

    const updatedData = {
      chapters: [...otherChapters, ...updatedChapters]
    };

    await updateChaptersData(updatedData);
    return updatedChapters;
  } catch (error) {
    console.error('Error updating chapters:', error);
    throw error;
  }
};

const getExamOrder = async () => {
    const query = gql`
        query GetExamOrder {
            examOrder(where: {id: "cm9fhma8u1xs207pme97r16aw"}) {
                examJsonOrder
            }
        }
    `;

    try {
        const result = await request(MASTER_URL, query);
        if (!result?.examOrder?.examJsonOrder) {
            return { examOrders: [] };
        }

        // Parse the JSON string and ensure it has the right structure
        let examData;
        try {
            examData = typeof result.examOrder.examJsonOrder === 'string' 
                ? JSON.parse(result.examOrder.examJsonOrder)
                : result.examOrder.examJsonOrder;

            // Ensure examOrders is an array with the required fields
            const examOrders = examData.examOrders?.map(order => ({
                examId: order.examId || '',
                courseNickname: order.courseNickname || '',
                order: order.order || 0,
                title: order.title || ''
            })) || [];

            return { examOrders };
        } catch (e) {
            console.error('Error parsing exam orders:', e);
            return { examOrders: [] };
        }
    } catch (error) {
        console.error('Error fetching exam orders:', error);
        return { examOrders: [] };
    }
};

const updateExamOrder = async (newData) => {
  const mutation = gql`
    mutation UpdateExamOrder {
      updateExamOrder(
        where: { id: "cm9fhma8u1xs207pme97r16aw" }
        data: { examJsonOrder: ${JSON.stringify(JSON.stringify(newData))} }
      ) {
        id
      }
      publishExamOrder(where: { id: "cm9fhma8u1xs207pme97r16aw" }) {
        id
      }
    }
  `;

  return await request(MASTER_URL, mutation);
};

const updateCourseExams = async (courseNickname, exams) => {
  try {
    const existingData = await getExamOrder();

    // Filter out exams of the current course
    const otherExams = existingData.examOrders?.filter(
      ex => ex.courseNickname !== courseNickname
    ) || [];

    // Add updated exams
    const updatedExams = exams.map((exam, index) => ({
      examId: exam.id,
      title: exam.title,
      order: index + 1,
      courseNickname
    }));

    const updatedData = {
      examOrders: [...otherExams, ...updatedExams]
    };

    await updateExamOrder(updatedData);
    return updatedExams;
  } catch (error) {
    console.error('Error updating exam order:', error);
    throw error;
  }
};


const getOffer = async () => {
  const query = gql`
   query GetAllCourses {
  offer(where: {id: "cm9flmj6y20c107pmtuftf60w"}) {
    docname
    first
    fourth
    fetures
    name
    priceafter
    pricebefore
    second
    stage
    third
  }
}
  `;
  const result = await request(MASTER_URL, query);
  return result;
};

const updateOffer = async (offerData) => {
  try {
    // Handle multiline strings and escape characters
    const sanitizedData = {
      ...offerData,
      fetures: offerData.fetures?.replace(/\n/g, '\\n').replace(/"/g, '\\"') || '',
      first: offerData.first?.replace(/"/g, '\\"') || '',
      second: offerData.second?.replace(/"/g, '\\"') || '',
      third: offerData.third?.replace(/"/g, '\\"') || '',
      fourth: offerData.fourth?.replace(/"/g, '\\"') || '',
      docname: offerData.docname?.replace(/"/g, '\\"') || '',
      name: offerData.name?.replace(/"/g, '\\"') || '',
    };

    const mutation = gql`
      mutation UpdateOffer {
        updateOffer(
          where: { id: "cm9flmj6y20c107pmtuftf60w" }
          data: { 
            docname: "${sanitizedData.docname}",
            first: "${sanitizedData.first}",
            fourth: "${sanitizedData.fourth}",
            fetures: "${sanitizedData.fetures}",
            name: "${sanitizedData.name}",
            priceafter: ${sanitizedData.priceafter || 0},
            pricebefore: ${sanitizedData.pricebefore || 0},
            second: "${sanitizedData.second}",
            third: "${sanitizedData.third}"
          }
        ) {
          id
          stage
        }
        publishOffer(where: { id: "cm9flmj6y20c107pmtuftf60w" }) {
          id
        }
      }
    `;

    const result = await request(MASTER_URL, mutation);
    return result;
  } catch (error) {
    console.error('GraphQL Error:', error);
    throw error;
  }
};

const getQuizById = async (quizId) => {
  const query = `
  query MyQuery {
      exam(where: {id: "${quizId}"}) {
          id
          jsonexam
      }
  }`;

  const result = await request(MASTER_URL, query);
  return result;
};

const deleteActivation = async (activationId) => {
  try {
    const existingData = await getActivationData();
    let activations = JSON.parse(existingData.actvition?.activit || '[]');

    // Filter out the activation to delete
    const updatedActivations = activations.filter(
      activation => activation.id !== activationId
    );

    // Update the data
    await updateActivationData(updatedActivations);
    return true;
  } catch (error) {
    console.error('Error deleting activation:', error);
    throw error;
  }
};

const updateAllCourses = async (data) => {
  // For each course in the data
  try {
      for (const course of data.courses) {
          // Update course data
          await updateCourse(course.id, course);
      }

      // If there are chapters, update them
      if (data.chapters) {
          for (const [courseNickname, chapters] of Object.entries(data.chapters)) {
              await updateCourseChapters(courseNickname, chapters);
          }
      }

      // If there are exams, update them
      if (data.exams) {
          await updateExamOrder(data.exams);
      }

      return { success: true };
  } catch (error) {
      console.error('Error updating courses:', error);
      throw error;
  }
};

const createBookOrder = async (orderData) => {
  const mutation = gql`
    mutation CreateBookOrder {
      createBookOrder(data: {
        name: "${orderData.name}",
        phone: "${orderData.phone}",
        governorate: "${orderData.governorate}",
        address: "${orderData.address}",
        bookId: "${orderData.bookId}",
        status: "pending"
      }) {
        id
      }
      publishBookOrder {
        id
      }
    }
  `;

  return await request(MASTER_URL, mutation);
};

const getBookOrders = async () => {
  const query = gql`
    query MyQuery {
      bookOrder(where: {id: "cm9mzx1m00zbd07obpqiv93u3"}) {
        id
        books
      }
    }
  `;

  const result = await request(MASTER_URL, query);
  return result;
};

const saveBookOrder = async (orderData) => {
  try {
    const existingData = await getBookOrders();
    let orders = [];
    try {
      orders = JSON.parse(existingData.bookOrder.books || '[]');
    } catch (e) {
      orders = [];
    }

    const newOrder = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...orderData
    };

    // Check if user has a pending order for the same book
    const hasPendingOrder = orders.some(order => 
      order.userEmail === orderData.userEmail && 
      order.bookId === orderData.bookId && 
      order.status === 'pending'
    );

    if (hasPendingOrder) {
      throw new Error('لديك طلب معلق لنفس الكتاب');
    }

    orders.push(newOrder);

    const mutation = gql`
      mutation UpdateBookOrder {
        updateBookOrder(
          where: { id: "cm9mzx1m00zbd07obpqiv93u3" }
          data: { books: ${JSON.stringify(JSON.stringify(orders))} }
        ) {
          id
        }
        publishBookOrder(where: { id: "cm9mzx1m00zbd07obpqiv93u3" }) {
          id
        }
      }
    `;

    return await request(MASTER_URL, mutation);
  } catch (error) {
    console.error('Error saving book order:', error);
    throw error;
  }
};

const updateBookOrders = async (orders) => {
  const mutation = gql`
    mutation UpdateBookOrder {
      updateBookOrder(
        where: { id: "cm9mzx1m00zbd07obpqiv93u3" }
        data: { books: ${JSON.stringify(JSON.stringify(orders))} }
      ) {
        id
      }
      publishBookOrder(where: { id: "cm9mzx1m00zbd07obpqiv93u3" }) {
        id
      }
    }
  `;

  return await request(MASTER_URL, mutation);
};

const getBooks = async () => {
  const query = gql`
    query GetBooks {
      bookOrder(where: {id: "cm9n1q4oi10dx07obh81ejrsv"}) {
        id
        books
      }
    }
  `;

  const result = await request(MASTER_URL, query);
  return result;
};

const saveBooks = async (booksData) => {
  const mutation = gql`
    mutation UpdateBooks {
      updateBookOrder(
        where: { id: "cm9n1q4oi10dx07obh81ejrsv" }
        data: { books: ${JSON.stringify(JSON.stringify(booksData))} }
      ) {
        id
      }
      publishBookOrder(where: { id: "cm9n1q4oi10dx07obh81ejrsv" }) {
        id
      }
    }
  `;

  return await request(MASTER_URL, mutation);
};

export default {
  getOffer,
  addQuiz,
  sendquiz,
  getNotifications,
  createNotification,
  updateNotification,
  deleteNotification,
  sendExamData,
  sendEnroll4Admin,
  getAllCourseList,
  getcourseinfo, 
  getQuizDataWithEnroll,
  SaveGradesOfQuiz,
  data4admin,
  editStateSub,
  publishEnrolls,
  getPaymentLogs,
  getAllExams,
  updateExam,
  getQuizJsonResult,
  getQuizResults,
  updateQuizResults, 
  getActivationData,
  updateActivationData,
  saveNewActivation,
  updateActivationStatus,
  checkUserEnrollment,
  addManualActivation,
  createCourse,
  updateCourse,
  getChaptersData,
  updateChaptersData,
  addChaptersForCourse,
  updateCourseChapters,
  initializeChapterData,
  getExamOrder,
  updateExamOrder,
  updateCourseExams,
  updateOffer,
  getQuizById,
  deleteActivation,
  updateAllCourses,
  createBookOrder,
  getBookOrders,
  saveBookOrder,
  updateBookOrders,
  getBooks,
  saveBooks,
}