export default defineNuxtRouteMiddleware(() => {
  const cookie = useCookie('auth_token');
  if (cookie.value) {
    return navigateTo('/room-work');
  }
})
