const User = require('../models/User')
// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt')
const bcryptSalt = 10

const createUser = async userInfo => {
  try {
    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(userInfo.password, salt)
    const newUser = new User({ ...userInfo, password: hashPass })
    const created_user = await newUser.save()
    console.log('user created: ', created_user)
    return created_user
  } catch (err) {
    console.error(err, 'error during user creation')
  }
}

const findUserBy = async (searchquery, searchterm) => {
  try {
    let foundUser
    if (searchquery === 'username') {
      foundUser = await User.findOne({ username: searchterm })
    }
    if (searchquery === 'google_id') {
      foundUser = await User.findOne({ google_id: searchterm })
    }
    if (searchquery === 'facebook_id') {
      foundUser = await User.findOne({ facebook_id: searchterm })
    }
    if (searchquery === 'email') {
      foundUser = await User.findOne({ email: searchterm })
    }
    foundUser = await User.populate(foundUser, {
      path: '_meetups',
      populate: [
        { path: '_departure_locations', model: 'Location' },
        { path: '_suggested_locations', model: 'Location' },
      ],
    })
    return foundUser !== null ? foundUser : false
  } catch (err) {
    console.log(err, 'error during user lookup')
  }
}

const createGoogleUser = async profile => {
  const newUser = await new User({
    username: profile.displayName,
    google_id: profile.id,
    firstName: profile.name.givenName,
    lastName: profile.name.familyName,
    email: profile.email,
  }).save()
  console.log('new google user created', newUser)
  return newUser
}

const createFacebookUser = async profile => {
  console.log('picture url', profile.pictureUrl)
  const newUser = await new User({
    username: profile.name,
    facebook_id: profile.id,
    firstName: profile.name.substr(0, profile.name.indexOf(' ')),
    lastName: profile.name.substr(profile.name.indexOf(' ') + 1),
    email: profile.email,
    avatar_url: profile.pictureUrl,
  }).save()
  console.log('new facebook user created', newUser)
  return newUser
}

const checkUsernamePassword = async (username, password) => {
  try {
    const foundUser = await findUserBy('username', username)
    if (!foundUser) {
      return false
    }
    if (!bcrypt.compareSync(password, foundUser.password)) {
      console.log('here')
      return foundUser
    }
  } catch (err) {
    console.error(err)
  }
}

module.exports.findUserBy = findUserBy
module.exports.createUser = createUser
module.exports.checkUsernamePassword = checkUsernamePassword
module.exports.createFacebookUser = createFacebookUser
module.exports.createGoogleUser = createGoogleUser
