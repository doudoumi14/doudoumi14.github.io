// The static build is served straight from the assets binding. This script
// exists for one reason: the zone does not force HTTPS, so http://adembrouri.com/
// answered 200 with the same page, which Google files as one more duplicate.
// Redirecting here keeps the fix in the repo rather than in a dashboard toggle.
export default {
  fetch(request, env) {
    const url = new URL(request.url);
    if (url.protocol === "http:") {
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
