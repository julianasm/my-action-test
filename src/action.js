const core = require('@actions/core');
const github = require('@actions/github');
const { default: axios } = require('axios');
const {TwitterClient} = require('twitter-api-client');



async function run() {
    const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');
    const TENOR_TOKEN = core.getInput('TENOR_TOKEN');

    const randomPos = Math.floor(Math.random() * 100);
    const url = `https://api.tenor.com/v1/search?q=thank%20you&pos=${randomPos}&limit=1&media_filter=minimal&contentfilter=high&key=${TENOR_TOKEN}`;
    var gifUrl;

    await axios.get(url).then(function (response) {
        let request_data = response.data.results;
        gifUrl = request_data[0].media[0].tinygif.url;
    }).catch(function (error) {
        console.log(error)
    })
    
    const octokit = github.getOctokit(GITHUB_TOKEN);

    const { context = {} } = github;
    const { pull_request } = context.payload;

    await octokit.rest.issues.createComment({
        ...context.repo,
        issue_number: pull_request.number,
        body: `Thank you for submitting a pull request! We will try to review this as soon as we can.\n\n<img src="${gifUrl}" alt="thank you">`
    });

    const {TwitterClient} = require('twitter-api-client');

    const tweet = async (status) => {
        const twitterClient = new TwitterClient({
        apiKey: process.env.TWITTER_API_KEY,
        apiSecret: process.env.TWITTER_API_SECRET,
        accessToken: process.env.TWITTER_API_ACCESS_TOKEN,
        accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });

    await twitterClient.tweets.statusesUpdate({status});
    };

    (async () => {
    try {
    const myTweet = 
          'Teste';

        await tweet(myTweet);
    } catch (err) {
        console.error(err);
    }
})();

}


run();