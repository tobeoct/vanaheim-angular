export const EnvConstants = {
    verify: {

        v2: {
            baseUrl: 'https://app.verified.ng',
            accountInquiry: {
                apiKey: "7UBUKPMxF8i99DgB",
                userId: '1543318849803',
                endpoint: '/inquiry/api/sacctinq/bvn/wrapper'
            },
            bvnValidation:{
                apiKey: "zeb'V8U*-h*e-jO'",
                userId: '1543318849803',
                endpoint:'/bvn-service/api/svalidate/wrapper'
            }
        },
        v3: {
            baseUrl: "https://api.verified.africa",
            accountInquiry: {
                apiKey: "7UBUKPMxF8i99DgB",
                userId: '1543318849803',
                endpoint: "/sfx-verify/v3/id-service/"
            }
        }
    }

}