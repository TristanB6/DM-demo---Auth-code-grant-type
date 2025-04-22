import './style.css';
var appElt = document.querySelector('#app');

/***************************
 * 
 * GLOBAL DEFINE 
 * 
 ***********************************/
const public_API_key = import.meta.env.VITE_public_API_key;
const public_API_key_secret = import.meta.env.VITE_public_API_key_secret;


/***************************
 * 
 * AUTH CODE METHOD
 * 
 ***********************************/

/**********  Setup generation of auth code ******/
const callback_URI = import.meta.env.VITE_callback_URL || "http://localhost:5173/auth-code-url.html";
let auth_URL = `https://api.dailymotion.com/oauth/authorize?response_type=code&client_id=${public_API_key}&redirect_uri=${callback_URI}&scope=userinfo+read+manage_videos+email`;
document.querySelector('#auth-code-url').href = auth_URL;

/**********  Collect code after redirection, request access token, and redirect user to clean url ******/
const urlParams = new URLSearchParams(window.location.search);
const auth_code = urlParams.get("code");

// Wrap the async code in an immediately invoked async function
(async () => {
  if(auth_code){
    console.log('Auth code detected, requesting access token');

    let access_token_URL = `https://api.dailymotion.com/oauth/token`;
    try {
      const response = await fetch(access_token_URL,{
        method:"POST",
        mode : "cors", // use Moesif Origin chrome extension to enable CORS on localhost
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type:"authorization_code",
          client_id: public_API_key,
          client_secret: public_API_key_secret,
          redirect_uri: callback_URI,
          code: auth_code,
          // scope:["userinfo" ,"manage_videos" ,"email", "read" ,"write"], // need it in the auth_URL too
        }),
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      console.log(json);

      // Check if tokens were successfully received
      if (json.access_token && json.refresh_token && json.expires_in) {
        // Store tokens in localStorage
        localStorage.setItem("auth_code_access_token", json.access_token);
        localStorage.setItem("auth_code_refresh_token", json.refresh_token);
        localStorage.setItem("auth_code_scope", json.scope);
        
        // Calculate the new expiration time
        const expirationTime = Date.now() + json.expires_in * 1000;
        localStorage.setItem("auth_code_expires_at", expirationTime);

        console.log('Tokens saved to localStorage');
        
        // Redirect to main page using the callback URL without the auth-code-url.html part
        const mainPageUrl = callback_URI.replace('auth-code-url.html', '');
        window.location.href = mainPageUrl;
      } else {
        console.error('Tokens not found in response');
      }
    } catch (error) {
      console.error(error);
    }
  }
})();

/**********  Function to display tokens on the frontend ******/
// Function to display tokens on the frontend and update the remaining expiration time dynamically
function displayTokens() {
  // Get the tokens and expiration time from localStorage
  const accessToken = localStorage.getItem("auth_code_access_token");
  const refreshToken = localStorage.getItem("auth_code_refresh_token");
  const expiresAt = localStorage.getItem("auth_code_expires_at");
  const scope = localStorage.getItem("auth_code_scope");

  // Check if tokens exist
  if (accessToken && refreshToken && expiresAt && scope) {
    // Update the HTML elements with the token values
    document.querySelector("#auth-code-access-token span").textContent = accessToken;
    document.querySelector("#auth-code-refresh-token span").textContent = refreshToken;
    document.querySelector("#auth-code-scope span").textContent = scope;

    // Function to update the expiration time dynamically
    const updateExpirationTime = () => {
      const remainingTime = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)); // in seconds
      const expiresInElement = document.querySelector("#auth-code-expires-in span");

      // Update the expiration time on the UI
      expiresInElement.textContent = `${remainingTime} seconds`;

      if (remainingTime === 0) {
        clearInterval(expirationInterval); // Stop updating when expired
        console.log("Access token has expired");

        // Add the "not-valid" class to indicate invalid tokens
        document.querySelector("#auth-code-access-token").classList.add("not-valid");
        document.querySelector("#auth-code-refresh-token").classList.add("not-valid");
        document.querySelector("#auth-code-expires-in").classList.add("not-valid");
        document.querySelector("#auth-code-scope").classList.add("not-valid");
      }else{
         // Remove the "not-valid" class initially since tokens are valid
        document.querySelector("#auth-code-access-token").classList.remove("not-valid");
        document.querySelector("#auth-code-refresh-token").classList.remove("not-valid");
        document.querySelector("#auth-code-expires-in").classList.remove("not-valid");
        document.querySelector("#auth-code-scope").classList.remove("not-valid");
      }
    };

    // Set an interval to update the expiration time every second
    const expirationInterval = setInterval(updateExpirationTime, 1000);
    updateExpirationTime(); // Call immediately to show the initial value
  } else {
    console.log("No tokens found in localStorage");
  }
}

// Call the function to display tokens when the page loads
displayTokens();

/**********  Refresh token ******/
document.querySelector('#auth-code-refresh-access-token').addEventListener('click',async function(){
  const refreshToken = localStorage.getItem("auth_code_refresh_token");
  if(refreshToken){
    let access_token_URL = `https://api.dailymotion.com/oauth/token`;
    try {
      const response = await fetch(access_token_URL,{
        method:"POST",
        mode : "cors", // use Moesif Origin chrome extension to enable CORS on localhost
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          client_id: public_API_key,
          client_secret: public_API_key_secret,
          refresh_token: localStorage.getItem("auth_code_refresh_token"),
        }),
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      console.log(json);
  
      // Check if tokens were successfully received
      if (json.access_token && json.refresh_token && json.expires_in) {
        // Store tokens in localStorage
        localStorage.setItem("auth_code_access_token", json.access_token);
        localStorage.setItem("auth_code_refresh_token", json.refresh_token);
        localStorage.setItem("auth_code_scope", json.scope);
        
        // Calculate the new expiration time
        const expirationTime = Date.now() + json.expires_in * 1000;
        localStorage.setItem("auth_code_expires_at", expirationTime);
  
        console.log('Tokens saved to localStorage');
        
        // Redirect to main page using the callback URL without the auth-code-url.html part
        const mainPageUrl = callback_URI.replace('auth-code-url.html', '');
        window.location.href = mainPageUrl;
      } else {
        console.error('Tokens not found in response');
      }
    } catch (error) {
      console.error(error);
    }
  }
})




async function getData(url) {
  try {
    const response = await fetch(url,{
      method:"GET",
      mode : "no-cors"
    });
    console.log(response);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json)
    
  } catch (error) {
    console.error(error);
  }
}
// getData('https://api.dailymotion.com/user/x39ctf6/videos?fields=title,id,private_id');
// getData('https://api.dailymotion.com/user/x3b8e3o?fields=email');
