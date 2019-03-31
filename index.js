const axios = require('axios');

function getResponseBody(data){
  return `<!DOCTYPE html>
   <html>
    <head>
      <meta charset="utf-8">
      <title>${data.title}</title>

      <!-- Search Engine -->
      <meta name="description" content="${data.description}">
      <meta name="image" content="${data.imgSrc}">

      <!-- Schema.org for Google -->
      <meta itemprop="name" content="${data.title}">
      <meta itemprop="description" content="${data.description}">
      <meta itemprop="image" content="imgSrc">

      <!-- Open Graph general (Facebook, Pinterest & Google+) -->
      <meta prefix="og: http://ogp.me/ns#" name="og:type" content="website">
      <meta prefix="og: http://ogp.me/ns#" name="og:title" content="${data.title}">
      <meta prefix="og: http://ogp.me/ns#" name="og:description" content="${data.description}">
      <meta prefix="og: http://ogp.me/ns#" name="og:image" content="${data.imgSrc}">
      <meta prefix="og: http://ogp.me/ns#" name="og:url" content="${data.url}">
      <meta prefix="og: http://ogp.me/ns#" name="og:site_name" content="${data.title}">
    </head>
    <body>
      <p>name: ${data.title}</p>
      <p>description: ${data.description} </p>
    </body>
 </html>`
}


module.exports.handler = async (event, context, callback) => {

  // Get the request from cloudfront
    let request = event.Records[0].cf.request
    let headers = request.headers
    let useragent = JSON.stringify(headers["user-agent"][0].value)

    console.log('Request UA: '+useragent)

    // Check for the following useragent
    let botUserAgentPattern = new RegExp(process.env.BOT_USER_AGENT)
    let isBotUserAgent = botUserAgentPattern.test(useragent)

    // for non-bot request
    if (!isBotUserAgent) {
      console.log('Non-bot UA.');
      callback(null, request);
      return
    }

    // Construct http response for social sites.
    console.log('Bot UA: ');

    const res = await axios.get(process.env.EXTERNAL_API);

    // Load res into the data obj
    let data = {
      title: 'title',
      description: 'description',
      imgSrc: 'imgSrc',
      url: 'url'
    };

    console.log('ResponseData: '+JSON.stringify(data))

    let responseBody = getResponseBody(data)

    const response = {
      status: '200',
      statusDescription: 'OK',
      body: responseBody
    };

      // Return reponse
    callback(null, response);
};