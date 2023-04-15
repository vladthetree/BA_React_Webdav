export default function userModel(
  username,
  password,
  webdavAddress,
  nextCloudUserName,
  nextCloudPassword,
) {
  return {
    username,
    password,
    webdavAddress: `${webdavAddress}resident_${username}`,
    nextCloudUserName,
    nextCloudPassword,
  };
}
