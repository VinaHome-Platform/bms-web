export default defineNuxtRouteMiddleware(() => {
  const cookie_access_token = useCookie('access_token');
  if (!cookie_access_token.value) {
    return navigateTo('/');
  }
})
