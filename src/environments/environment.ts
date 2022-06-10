export const environment = {
  production: true,
  external: {
    ngagen: "https://ngagen.com/sportzchain",
  },
  aws: {
    cognitoUserPoolId: "ap-south-1_cskOywi8T", // Prod OTP user pool
    cognitoAppClientId: "27jigg1llfuua4hi3ksmrp5v56", // OTP user pool
  },
  google: {
    apiKey: "529923472550-1p04dcfp0hpvr98uka92g8kuecbmbd1u.apps.googleusercontent.com",
    secret: "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",
  },
  facebook: {
    apiKey: "1408849096241583",
    secret: "1c00df0fcc4e7f287991fab057edfa41",
  },
  api: {
    profileService: "https://38cbdret50.execute-api.ap-south-1.amazonaws.com/prod/signup/v1/getprofile",
    claimBonus: "https://38cbdret50.execute-api.ap-south-1.amazonaws.com/prod/signup/v1/submitclaim",
    rewardHistory: "https://38cbdret50.execute-api.ap-south-1.amazonaws.com/prod/signup/v1/getrewardhistory",
    updateProfile: "https://38cbdret50.execute-api.ap-south-1.amazonaws.com/prod/signup/v1/updateprofile",
  },
  launchdate: {
    date: "Mar 21, 2022 18:00:01",
  },
  timeout: {
    timeout: 600,
    timeoutWarning: 10,
  },
  filteredDomain: {
    domains: "songsign,sofrge,siberpay,tonaeto,snece",
  },
  recaptcha: {
    siteKeyV2: '6LfKNi0cAAAAACeYwFRY9_d_qjGhpiwYUo5gNW5-',
    siteKeyV3: '6LdcDb0eAAAAANgWztOPQPn1PHeWZvXqa7cSnrUX',
  },
};
