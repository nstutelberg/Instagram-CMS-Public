class CheckTokenStatus {
  async checkStatus(axios, sixtyDayToken) {
    try {
      const response = await axios.get(`https://graph.instagram.com/me?access_token=${sixtyDayToken}`);
      console.log('Token is working');
    } catch (error) {
      console.error('Error checking token status:', error.message);
    }
  }
}

module.exports = CheckTokenStatus;
