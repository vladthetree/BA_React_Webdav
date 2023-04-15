import listContent from './api/listContent.js';

const getAvailableContent = (userdata) => async (dispatch) => {
  try {
    const contentArray = await listContent(userdata);
    console.log("1 --",contentArray)
    dispatch({
      type: 'SET_AVAILABLE_VIDEOS',
      payload: contentArray,
    });
    console.log("2 --",contentArray)
    return contentArray;
  } catch (error) {
    console.error('Error fetching videos:', error);
  }
};

export { getAvailableContent };
