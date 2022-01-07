export const EnvConstants = {

    MAX_ACTIVE_EARNING_REQUESTS: 1000,
    verify: {

        v2: {
            baseUrl: 'https://app.verified.ng',
            accountInquiry: {
                apiKey: process.env.VERIFY_ACCOUNTINQUIRY_APIKEY,
                userId: process.env.VERIFY_USERID,
                endpoint: '/inquiry/api/sacctinq/bvn/wrapper'
            },
            bvnValidation: {
                apiKey: process.env.VERIFY_BVN_APIKEY,
                userId: process.env.VERIFY_USERID,
                endpoint: '/bvn-service/api/svalidate/wrapper'
            }
        },
        v3: {
            baseUrl: "https://api.verified.africa",
            accountInquiry: {
                apiKey: process.env.VERIFY_ACCOUNTINQUIRY_APIKEY,
                userId: process.env.VERIFY_USERID,
                endpoint: "/sfx-verify/v3/id-service/"
            },
            bvnValidation:{
                apiKey: process.env.VERIFY_BVN_APIKEY,
                userId: process.env.VERIFY_USERID,
                endpoint:'/sfx-verify/v3/id-service/'
            }
        }
    }

}