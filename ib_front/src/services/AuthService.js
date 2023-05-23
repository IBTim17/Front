import jwt from 'jwt-decode';

function getRole() {
    const jwtoken = localStorage.getItem('access_token');
    const token = jwt(jwtoken);
    console.log(token);
    return token.role[0].authority;
}

function logout() {
    localStorage.removeItem("access_token");
  }

export default getRole && logout;