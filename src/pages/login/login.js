import {
    Authenticator,
    useTheme,
    Text,
    Button,
    View,
    Heading,
    useAuthenticator,
    Grid,
  } from '@aws-amplify/ui-react';
  import './login.css';
  import companyLogo from '../../assets/images/AG-logo.png'

  
  
  const components = {
    Header() {
      const { tokens } = useTheme();
  
      return (
        <View textAlign="center" padding={tokens.space.large}>
          {/* <Image
            alt="HealthPlus Logo"
            src={}
          /> */}
        </View>
      );
    },
  
    Footer() {
      const { tokens } = useTheme();
  
      return (
        <View textAlign="center" padding={tokens.space.large}>
          <Text color={tokens.colors.neutral[80]}>
            &copy; All Rights Reserved {new Date().getFullYear()}
          </Text>
        </View>
      );
    },
  
    SignIn: {
      Header() {
        const { tokens } = useTheme();
  
        return (
          <Heading
            padding={`${tokens.space.xl} 0 0 0`}
            level={4}
            textAlign="center"
          >
            Inbound Planning System
          </Heading>
        );
      },
      Footer() {
        // const { toResetPassword } = useAuthenticator();
        
        return <></>
        // return (
        //   <View textAlign="center">
        //     <Button
        //       fontWeight="normal"
        //       onClick={toResetPassword}
        //       size="small"
        //       variation="link"
        //     >
        //       Reset Password
        //     </Button>
        //   </View>
        // );
      },
    },
  
    SignUp: {
      Header() {
        const { tokens } = useTheme();
  
        return (
          <Heading
            padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
            level={4}
          >
            Create Your Admin Account
          </Heading>
        );
      },
      Footer() {
        const { toSignIn } = useAuthenticator();
  
        return (
          <View textAlign="center">
            <Button
              fontWeight="normal"
              onClick={toSignIn}
              size="small"
              variation="link"
            >
              Back to Sign In
            </Button>
          </View>
        );
      },
    },
    ConfirmSignUp: {
      Header() {
        const { tokens } = useTheme();
        return (
          <Heading
            padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
            level={3}
          >
            Enter Information:
          </Heading>
        );
      },
      Footer() {
        return <Text>Footer Information</Text>;
      },
    },
    SetupTOTP: {
      Header() {
        const { tokens } = useTheme();
        return (
          <Heading
            padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
            level={3}
          >
            Enter Information:
          </Heading>
        );
      },
      Footer() {
        return <Text>Footer Information</Text>;
      },
    },
    ConfirmSignIn: {
      Header() {
        const { tokens } = useTheme();
        return (
          <Heading
            padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
            level={3}
          >
            Enter Information:
          </Heading>
        );
      },
      Footer() {
        return <Text>Footer Information</Text>;
      },
    },
    ForceNewPassword: {
      Header() {
        return (
          <Heading
            level={3}
          >
            Create New Password
          </Heading>
        );
      },
      Footer() {
        const { toSignIn } = useAuthenticator();
        return (
          <View textAlign="center">
            <Button
              fontWeight="normal"
              onClick={toSignIn}
              size="small"
              variation="link"
            >
              Back to Sign In
            </Button>
          </View>
        );
      },
    },
    ResetPassword: {
      Header() {
        return (
          <Heading
            level={3}
          >
            Reset your password
          </Heading>
        );
      },
    },
    ConfirmResetPassword: {
      Header() {
        return (
          <Heading
            level={3}
          >
            Create New Password
          </Heading>
        );
      },
    },
  };
  
  const formFields = {
    signIn: {
      username: {
        placeholder: 'Enter your username',
      },
      password: {
        placeholder: 'Enter your password',
      },
    },
    forceNewPassword: {
      password: {
        placeholder: 'Enter your password',
      },
    },
    resetPassword: {
      username: {
        placeholder: 'Enter your username',
      },
    },
    confirmResetPassword: {
      confirmation_code: {
        placeholder: 'Enter your confirmation code',
        label: 'Confirmation Code',
        isRequired: false,
      },
      confirm_password: {
        placeholder: 'Enter your password again',
      },
    },
    setupTOTP: {
      QR: {
        totpIssuer: 'test issuer',
        totpUsername: 'amplify_qr_test_user',
      },
      confirmation_code: {
        label: 'New Label',
        placeholder: 'Enter your confirmation code',
        isRequired: false,
      },
    },
    confirmSignIn: {
      confirmation_code: {
        label: 'New Label',
        placeholder: 'Enter your Confirmation Code:',
        isRequired: false,
      },
    },
  };
  
  export default function Login() {
    return (
      <Grid minHeight="100vh" justifyContent="center" className="container">
        <img src={companyLogo} style={{position: 'absolute', width: '200px', margin: '10px', padding: '5px', backgroundColor: '#eee'}} />
        <Authenticator formFields={formFields} components={components} hideSignUp />
      </Grid>
    );
  }
  