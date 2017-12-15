import * as A from '../actionTypes'

export const signIn = (user, password) =>
[
    {
      type: A.LOGIN_SUCCESS_USER,
      username: user,
      password: password
    },
    {
      type: A.MENU_SHOW_ALL,
    },
    {
      type: A.POST_SHOW_FEATURES,
      username: user,
    }
]

export const signOut = () =>
[
    {
      type: A.LOGOUT_SUCCESS
    },
    {
      type: A.MENU_SHOW_DEFAULT
    },
    {
      type: A.POST_HIDE_FEATURES
    },
  ]
