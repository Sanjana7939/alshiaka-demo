export const awsconfig = {
    Auth: {
      region: process.env.REACT_APP_AWS_REGION,
      userPoolId: process.env.REACT_APP_COGNITO_USER_POOL,
      userPoolWebClientId: process.env.REACT_APP_COGNITO_APP_CLIENT_ID,
    },
  };
  