import * as Realm from "realm-web";

const app = new Realm.App({ id: 'data-xwlurwz' });

async function loginEmailPassword(email, password) {
  // Create an email/password credential
  const credentials = Realm.Credentials.emailPassword(email, password);
  // Authenticate the user
  const user = await app.logIn(credentials);
  // 'App.currentUser' updates to match the logged in user
  console.assert(user.id === app.currentUser.id);
  return user;
}


    const user = await loginEmailPassword('guixr24.dev', 'd5hfKfXeerzyP6FQ');
    export const APIToken = user.accessToken;





