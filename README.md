# JavaScript-Instagram-CMS

javascript task
-Periodically pull in Instagram posts to our cms sanity.io from an arbitrary instagram account (content management system)
-scheduled/backgrounf function is used to run code at the same time every day. 
	-background functions are better for batch processing, but scheduled jobs are better if task is going to be recurring]
-livenation is the client and they want us to pull in their posts from their new instagram page live_nation_venues 
-can test this CMS on a public instagram account - livenation...and then once I get that working locally, can integrate with codebase
-might need to do something with instagram Oauth and their API since in order to pull data from their API you need authentication. 
-BIG PROBLEM - when you generate a key the authentication runs out after about 60 days. We want to have a constant stream of information from instagram without the authentication running out. there are some limitations

sanity - place to edit content. its a CMS that is sebs favorite. 
		build fields in the cms using code / sanity studio. seb has a repo for sanity

steps 
1. find a public instagram account (livenation)
2. try to connect to that instagram and pull content from it and inject it into the CMS (sanity.io)
	- want to store the post, the caption, the general information. not the analytics
	- could create a site from this information
	- try to get top 10 most recent instagram posts first as a starter point
	- need to pull data from instagram API and need to do OAUTH token to get that info
		-https://rapidapi.com/blog/how-to-navigate-and-connect-to-instagrams-api/
3. store the content on sanityIO
	

first easy step
1. use above instagram link to get into api, make dev account, get oauth...then try to pull some instagram posts from a page and log the posts to the console. want to show that I have access to the posts
2. then after that, can work with sanity to try to get that information into sanity

	
Questions

	-is it for bean.la instagram or for a client? client

	-what frequency do you want the scheduled functiont to run on? 

	-don't I need a site to be able to view results?


https://levelup.gitconnected.com/getting-started-with-the-instagram-basic-display-api-5124c92c4935







Steps taken
1. I used the Instagram Basic Display API vs the Instagram Graph API since the graph one is for content creators and business owners. https://developers.facebook.com/docs/instagram-basic-display-api/. And we get all the info we need from the basic one
	- no tokenization needed for public accounts. For a private account, there is a 60 days period until the token expires: https://developers.facebook.com/docs/instagram-basic-display-api/guides/long-lived-access-tokens
	- refreshing a token is easy though, can make a script to request info from the API on a set schedule using the commands in the link above
2. Installed Yarn and then created a Nuxt App with `yarn create nuxt-app nuxt-app`
	- used Vuetify.js framework with HTML engine, and used Axios for promise based HTTP client. Since Instagram API requires that you make HTTP requests, have to go with this option for the Nuxt.js module
	- used this link as a guide: https://rapidapi.com/blog/instagram-api-javascript/
3. Created a facebook development account
	- created an app with a "consumer" type vs none type..None type has permissions to everything but only consumer type can be used without setting up a business manager account on meta
	-used this tutorial
	-downloaded ngrok to create an http tunnel to my localhost page http://localhost:3000/
	-in the git folder structure, ran ngrok.exe and executed:
		-ngrok config add-authtoken 2OW7tult6YiwP5oM2ED5n1bIV7C_4fftTFR9huWQDikS7H6gs
		-ngrok http 3000
			-this adds authentication and then sets a redirect from https://6af9-173-31-211-214.ngrok-free.app to http://localhost:3000/
	-created an app just for the instagram basic display api and have the codes and secretes to it. Link here: https://developers.facebook.com/apps/584537917073859/settings/advanced/
		- Instagram App ID = 143737001962080
		- Instagram App Secret = 8cc4d26a5b6d0a53fff49bb62776b04d
4. set up Oauth on the facebook app
	- in the app settings, don't need to specify specific links for the user to redirected to for Oauth redirect URL, callback URL and data deletion URL
	- instead, I set the link for all 3 of these to https://httpstat.us/200 . This is a placeholder site so instagram can redirect here if needed.



Steps summarized
Create a Facebook App and configure it to use the Instagram Basic Display API.
Set up our app’s Valid OAuth Redirect URI so that we can successfully navigate through Instagram’s “Authorization Window.”
Add an Instagram Tester, which is an Instagram account to which we have access. Then, as that Instagram user, accept the invitation to be a tester.
Visit the URL for displaying Instagram’s “Authorization Window,” which asks an Instagram user to authorize an app to access that user’s Instagram profile and media data.
Obtain the authorization code that is passed as a param to the OAuth Redirect URI after the user authorizes your app.
Send an HTTP request (using Postman) with this authorization code to exchange it for a short-lived API token (which is valid for 1 hour).
Take advantage of Postman’s variables to reuse values more easily across different requests.
Send another request with this short-lived token to exchange it for a long-lived API token (which is valid for the next 60 days).
Send requests with this long-lived token to query the API for a user’s profile and media data.
Send a request with this long-lived token to refresh the token, receiving back another token which is, once again, valid for the next 60 days.



https://api.instagram.com/oauth/authorize
  ?client_id=143737001962080
  &redirect_uri=https://6af9-173-31-211-214.ngrok-free.app/
  &scope=user_profile,user_media
  &response_type=code

https://api.instagram.com/oauth/authorize?client_id=143737001962080&redirect_uri=https://6af9-173-31-211-214.ngrok-free.app/&scope=user_profile,user_media&response_type=code
authorization code: AQD710LzuiQCcEj6tczy6JOjPrNU48FDho2PbRS5hzIdL3ZkUeUAXuFchdhnJWYaV4QEp-ZxF7NeQ-hJxIsx5Tu0jRkWTSrropxjRyDmCU79h864C5oDGOqgt-fmpQ18egy0NF43kbc4mT5qLqCXNywZgbSZnYm9vVJ5qy2FWagU1aj1S8v_NizwNp3CsctrnglrDwJDR1NXt81o6DFGB3efVTkfsLfXP3j7HIsKTWUMTA#_

curl -X POST \
  https://api.instagram.com/oauth/access_token \
  -F client_id=143737001962080
  -F client_secret=8cc4d26a5b6d0a53fff49bb62776b04d
  -F grant_type=authorization_code
  -F redirect_uri=https://6af9-173-31-211-214.ngrok-free.app/
  -F code=AQD710LzuiQCcEj6tczy6JOjPrNU48FDho2PbRS5hzIdL3ZkUeUAXuFchdhnJWYaV4QEp-ZxF7NeQ-hJxIsx5Tu0jRkWTSrropxjRyDmCU79h864C5oDGOqgt-fmpQ18egy0NF43kbc4mT5qLqCXNywZgbSZnYm9vVJ5qy2FWagU1aj1S8v_NizwNp3CsctrnglrDwJDR1NXt81o6DFGB3efVTkfsLfXP3j7HIsKTWUMTA#_


site for api settings: https://developers.facebook.com/docs/instagram-basic-display-api/reference/media