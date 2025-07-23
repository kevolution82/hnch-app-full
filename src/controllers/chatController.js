// send a message to the ai
exports.sendMessage = async (req, res) => {
  const { message } = req.body; // get the message from the request
  // this is just a fake ai response for now
  const simulatedAiReply = `AI response to: ${message}`; // make a reply using the message
  res.json({ reply: simulatedAiReply }); // send the reply back
};