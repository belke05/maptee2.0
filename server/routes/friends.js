const express = require('express')
const passport = require('passport')
const router = express.Router()
const friends_crud = require('../CRUD/CRUD_friends')
const uploader = require('../configs/cloudinary')

// signup up localy

router.post('/', (req, res) => {
  const friend_email = req.query.friendMail
  friends_crud
    .createAddRequest(friend_email, req.user._id)
    .then(created => {
      if (created) {
        res.status(200)
        res.json({ message: 'request send' })
      } else {
        res.status(404)
        res.json({ error: 'user not found' })
      }
    })
    .catch(err => console.error(err))
})

router.patch('/accept/:requestid', (req, res) => {
  const requestid = req.params.requestid
  friends_crud
    .acceptRequest(requestid)
    .then(accepted => {
      if (accepted) {
        res.status(200)
        res.json({ message: 'request accepted' })
      }
    })
    .catch(err => console.error(err))
})

router.patch('/decline/:requestid', (req, res) => {
  const requestid = req.params.requestid
  friends_crud
    .declineRequest(requestid)
    .then(accepted => {
      if (accepted) {
        res.status(200)
        res.json({ message: 'request accepted' })
      }
    })
    .catch(err => console.error(err))
})

module.exports = router