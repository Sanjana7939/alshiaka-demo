import { Auth } from "aws-amplify";

export const createAuthenticationHeaderForApi = async () => {
  try {
    const session = await Auth.currentSession();
    const token = session.idToken.jwtToken;

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  } catch (e) {
    return {};
  }
};
