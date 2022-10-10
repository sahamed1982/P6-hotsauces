const express = require('express');
const auth = require('../middleware/auth');
const saucesController = require('../controllers/sauces');
const multer = require('../middleware/multer-config');

const router = express.Router();
 
//***************************************************************************** */
//.......................  ROUTES SAUCES.................................
//***************************************************************************** */

router.post('/', auth, multer, saucesController.createSauce );

router.post('/:id/like',auth,saucesController.likeOrNotSauce);


router.put('/:id', auth, multer, saucesController.modifySauce);
router.delete('/:id', auth, saucesController.deleteSauce );
router.get ('/:id', auth, saucesController.getOneSauce );
router.get('/', auth, saucesController.getAllSauce);



module.exports = router