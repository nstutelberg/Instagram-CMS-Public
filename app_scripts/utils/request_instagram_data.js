class RequestInstagramData {

  // create async function so this API call executes first, so the media ID's from the instagram posts can be stored to be used in the 3rd API call
  async getData(axios, sixtyDayToken, baseInfoUrl, mediaUrl, rootUrl, client) {

    /*
    API CALL 1 - retrieving profile information
    */

    let profileData = [];

    // await keyword is used to wait for a promise to be resolved
    await axios.get(baseInfoUrl, {
      params: {
        access_token: sixtyDayToken,
        fields: 'account_type, username, media_count'
      }
    })
      .then(response => {
        profileData = response.data
        console.log(profileData)
        client.set('profileData', JSON.stringify(profileData), redis.print);
        // handle the response data, which contains the user ID and username
      })
      .catch(error => {
        console.log(error);
      });

    /*
    API CALL 2 - retrieving IDs of the media posted on the users profile
    */

    let mediaIds = [];
    let mediaData = [];

    await axios.get(mediaUrl, {
      params: {
        access_token: sixtyDayToken,
        fields: 'id, timestamp'
      }
    })
      .then(response => {
        mediaData = response.data;
        console.log(mediaData);

        // Extract the IDs from the response data and store them in an array to be used in API CALL 3
        mediaIds = mediaData.data.map(media => media.id);
        client.set('mediaData', JSON.stringify(mediaIds), redis.print);
      })
      .catch(error => {
        console.log(error);
      });

    /*
    API CALL 3 - retrieving the detailed post information from each media ID
    */

    let detailedMediaData = [];
    // limiting the amount of posts to be returned
    let topTenMediaIds = mediaIds.slice(0, 10);

    // awaiting the other API calls to finish before executing this one, then doing an iteration for each media ID to get the post information for each of these media IDs
    await Promise.all(topTenMediaIds.map(mediaId => axios.get(`${rootUrl}/${mediaId}`, {
      params: {
        access_token: sixtyDayToken,
        fields: 'caption, id, media_type, timestamp, permalink'
      }
    })
      .then(response => {
        console.log(response.data);

        // handle the response data for each media ID here. .push is used to append the post data onto the end of the detailedMediaData array
        detailedMediaData.push(response.data);
        client.set('detailedMediaData', JSON.stringify(detailedMediaData), redis.print);
      })
      .catch(error => {
        console.log(error);
      })));
  }
}
module.exports = RequestInstagramData;