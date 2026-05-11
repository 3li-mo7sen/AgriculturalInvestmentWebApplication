using System.Net;

namespace BackendAPI.Shared
{
    public class EmailStringBody
    {
        public static string send(string email, string token, string component, string message)
        {
            string encodeToken = Uri.EscapeDataString(token);
            return $@"
                     <html> 
                            <head>
<style>
.button{{
 border: none;
      border-radius: 10px;
      padding: 15px 30px;
      color: #fff;
      display: inline-block;
      background: linear-gradient(45deg, #ff7e5f, #feb47b);
      cursor: pointer;
      text-decoration: none;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
      font-size: 16px;
      font-weight: bold;
      font-family: 'Arial', sans-serif;
      animation: glow 1.5s infinite alternate;

}}
</style>
</head>
                            <body>
                                <h1>{message}</h1>
                                        <hr>
                                     <br>
                                    //<a class=""button"" href=""https://localhost:44388/api/Auth/active/account?email={email}&code={(token)}"">
                                    //        {message}
                                    //    </a>
                                    <a class=""button"" href=""http://192.168.1.11:5000/api/Auth/active/account?Email={email}&Token={token}"">
                                            {message}
                                        </a>
                            </body>
                        </html>
                    
                    ";
        }
    }
}
