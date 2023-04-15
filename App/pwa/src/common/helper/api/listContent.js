const listContent = async (userdata) => {
  try {

    const response = await fetch(
      `${process.env.DEFAULT_LOCALHOST}/listContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userdata.nextCloudUserName,
          password: userdata.nextCloudPassword,
          targetUrl: userdata.webdavAddress,
        }),
      },
    );
   
    const availableContent = await response.json();
    const availableVideosArray = Array.from(availableContent);
    return availableVideosArray;
  } catch (error) {
    console.error(error);
  }
};

export default listContent;
