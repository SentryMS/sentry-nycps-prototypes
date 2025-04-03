
exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  
  // Process data from event
  const processedData = {
    ...event,
    processed: true,
    timestamp: new Date().toISOString()
  };
  
  return {
    statusCode: 200,
    body: JSON.stringify(processedData)
  };
};
