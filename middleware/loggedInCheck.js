const withLog = function (req, res, next) {
  console.log(`auth token: ${JSON.stringify(req.cookies.token)}`)
  try {
    console.log(`req.session.isLoggedIn: ${req.session.isLoggedIn}`)
    if (!req.sesssion.isLoggedIn) {
      console.log("welcome in")
      res.status(200).send('cool');
    }
  } catch (err) {
    console.log("not logged in")
    res.status(401).send('Unauthorized: Not logged in');
  }
}
module.exports = withLog;