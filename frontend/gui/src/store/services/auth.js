import {createApi} from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from "../utils/axiosBaseQuery";

export const auth = createApi({
    reducerPath: 'authenticate',
    tagTypes: ['Auth'],
    baseQuery: axiosBaseQuery({
        baseUrl: 'http://127.0.0.1:8080/auth',
    }),
    endpoints: (builder) => ({
        authSession: builder.query({
            query: (data) => ({
                url: '/authenticate',
                method: 'post',
                data: data
            }),
        }),
        signup: builder.query({
            query: (account) => ({
                url: '/registration/graduate',
                method: 'post',
                data: account
            })
        }),
        sendConfirmation: builder.query({
            query: (data) => ({
                url: '/registration/email-confirmation',
                method: 'post',
                data: data
            })
        }),
        checkEmailVerification: builder.query({
            query: (arg) => ({
                url: `/registration/email-confirmation/check=${arg.email}`,
                method: 'get',
            })
        }),
        emailConfirmation: builder.query({
            query: (data) => ({
                url: '/password/reset/',
                method: 'post',
                data: data,
            })
        }),
        passwordReset: builder.query({
            query: (arg) => {
                console.log(arg)
                return ({
                    url: `/password/reset/confirm/${arg.uid}/${arg.token}/`,
                    method: 'post',
                    data: {
                        token: arg.token,
                        uid: arg.uid,
                        new_password1: arg.new_password1,
                        new_password2: arg.new_password2,
                    }
                })
            }
        })
    })
});