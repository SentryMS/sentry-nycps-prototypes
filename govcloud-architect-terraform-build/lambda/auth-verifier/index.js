
exports.handler = async (event) => {
  console.log('Received auth event:', JSON.stringify(event, null, 2));
  
  // Simple token verification logic
  const token = event.headers?.Authorization?.replace('Bearer ', '') || '';
  
  if (token === 'valid-token') {
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        isAuthorized: true,
        user: {
          id: '123456',
          role: 'admin'
        }
      })
    };
  }
  
  return {
    statusCode: 401,
    body: JSON.stringify({ 
      isAuthorized: false,
      message: 'Unauthorized access'
    })
  };
};
