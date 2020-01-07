import React, { useState, useEffect } from 'react'
import UserHomeNavigator from '../sub_components/UserHomeNavigator'
import SendRequestButton from '../sub_components/SendRequestButton'
import { store } from '../../redux/_store'
import api from '../../apis/friends_api'

export default function FriendPage(props) {
  const [state, setState] = useState({ secret: null, message: null })
  const [showMeetupForm, setshowMeetupForm] = useState(false)
  const [friends, setFriends] = useState(store.getState().user._friends)

  const sendHandler = email => {
    api
      .sendFriendRequest(email)
      .then(res => {
        console.log('request sent')
      })
      .catch(err => {
        console.error('request not send', err)
      })
  }

  return (
    <UserHomeNavigator
      activeIndex={3}
      history={props.history}
      setshowMeetupForm={setshowMeetupForm}
      showMeetupForm={showMeetupForm}
    >
      <div>{friends.toString()}</div>
      <SendRequestButton
        openbtn="send friend request"
        text="give in friends email to send him a request"
        title="Request"
        cancelbtn="cancel"
        sendbtn="send"
        className="send_friendrequest_container"
        sendHandler={sendHandler}
      />
    </UserHomeNavigator>
  )
}
