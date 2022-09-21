const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId // Nous extrayons l'ID utilisateur de notre token et le rajoutons à l’objet Request 
                                //afin que nos différentes routes puissent l’exploiter.
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};