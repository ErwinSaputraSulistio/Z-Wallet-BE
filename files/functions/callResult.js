exports.returnSuccess = (res, status, message) => {
   const output = {}
   output.callResult = "Success"
   output.statusCode = status
   output.outputData = message
   res.status(status).json(output)
}

exports.returnFailed = (res, status, message) => {
   const output = {}
   output.callResult = "Failed"
   output.statusCode = status
   output.errorMessage = message
   res.status(status).json(output)
}