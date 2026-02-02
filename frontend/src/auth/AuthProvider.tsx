import { type ReactNode } from 'react'
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import { authConfig, authEnabled } from './authConfig'
import { AuthContext } from './AuthContext'

type AuthProviderProps = {
  children: ReactNode
}

const FallbackProvider = ({ children }: AuthProviderProps) => (
  <AuthContext.Provider value={{
    isAuthenticated: false,
    isLoading: false,
    user: undefined,
    login: async () => undefined,
    logout: () => undefined,
    getAccessToken: async () => null,
    hasRole: () => false,
    hasPermission: () => false,
  }}>
    {children}
  </AuthContext.Provider>
)

const AuthBridge = ({ children }: AuthProviderProps) => {
  const {
    isAuthenticated,
    isLoading,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0()

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      isLoading,
      user,
      login: async (options) => {
        await loginWithRedirect({
          appState: { returnTo: options?.returnTo ?? window.location.pathname },
        })
      },
      logout: () => {
        logout({
          logoutParams: {
            returnTo: `${window.location.origin}${import.meta.env.BASE_URL}`,
          },
        })
      },
      getAccessToken: async () => (
        isAuthenticated ? await getAccessTokenSilently() : null
      ),
      hasRole: (role: string) => {
        const roles = (user?.[authConfig.roleClaim] ?? user?.roles ?? []) as string[]
        return roles.includes(role)
      },
      hasPermission: (permission: string) => {
        const permissions = (user?.[authConfig.permissionsClaim] ?? []) as string[]
        return permissions.includes(permission)
      },
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export default function AuthProvider({ children }: AuthProviderProps) {
  if (!authEnabled) {
    return <FallbackProvider>{children}</FallbackProvider>
  }

  return (
    <Auth0Provider
      domain={authConfig.domain}
      clientId={authConfig.clientId}
      authorizationParams={{
        redirect_uri: `${window.location.origin}${import.meta.env.BASE_URL}`,
        audience: authConfig.audience || undefined,
      }}
      cacheLocation="localstorage"
      useRefreshTokens
    >
      <AuthBridge>{children}</AuthBridge>
    </Auth0Provider>
  )
}
